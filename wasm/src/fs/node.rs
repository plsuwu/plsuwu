#![allow(dead_code)]

use super::wrapper::JsNode;

use super::err::{FsErr, FsError};
use super::perm::Acl;
use chrono::{DateTime, Utc};
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::{Rc, Weak};
use wasm_bindgen::prelude::*;

pub type FsResult<T> = core::result::Result<T, FsErr>;

const DEFAULT_OWNER: &str = "please";
const DEFAULT_GROUP: &str = "users";
const ROOT_OWNER: &str = "root";
const ROOT_GROUP: &str = "root";
const DEFAULT_DIRECTORY_SIZE: usize = 4096;

const POST_TYPES: [&str; 3] = ["ctfs", "notes", "miscellaneous"];
const FHS_DIRS: [&str; 15] = [
    "bin", "boot", "dev", "etc", "lib64", "mnt", "nix", "opt", "proc", "root", "run", "sys", "tmp",
    "usr", "var",
];

pub type NodeRef = Rc<RefCell<Node>>;
pub type WeakNodeRef = Weak<RefCell<Node>>;

pub enum Node {
    Dir(DirNode),
    File(FileNode),
}

pub struct NodeMeta {
    pub name: String,
    pub size: usize,
    pub owner: String,
    pub group: String,
    pub created: DateTime<Utc>,
    pub modified: DateTime<Utc>,
    pub permissions: u32,
}

pub struct DirNode {
    pub metadata: NodeMeta,
    pub aliases: Vec<String>,
    pub parent: Option<WeakNodeRef>,
    pub children: HashMap<String, NodeRef>,
    pub children_vec: Vec<NodeRef>,
}

pub struct FileNode {
    pub metadata: NodeMeta,
    pub parent: WeakNodeRef,
    pub slug: String,
}

#[wasm_bindgen]
pub struct FileSystem {
    root: NodeRef,
    pwd: NodeRef,
}

macro_rules! default_date {
    () => {
        DateTime::from_timestamp(0, 0).unwrap()
    };
}

impl Node {
    pub fn as_dir(&self) -> Option<&DirNode> {
        match self {
            Node::Dir(d) => Some(d),
            _ => None,
        }
    }

    pub fn as_dir_mut(&mut self) -> Option<&mut DirNode> {
        match self {
            Node::Dir(d) => Some(d),
            _ => None,
        }
    }

    pub fn name(&self) -> &str {
        match self {
            Node::Dir(d) => &d.metadata.name,
            Node::File(f) => &f.metadata.name,
        }
    }

    pub fn is_dir(&self) -> bool {
        matches!(self, Node::Dir(_))
    }

    pub fn can_read(&self) -> bool {
        // TODO: implement the actual logic i just cant really be bothered rn
        self.permissions() & Acl::OTHER_READ.bits() != 0
    }

    pub fn permissions(&self) -> u32 {
        match self {
            Node::Dir(d) => d.metadata.permissions,
            Node::File(f) => f.metadata.permissions,
        }
    }
}

impl Default for FileSystem {
    fn default() -> Self {
        Self::new()
    }
}

impl NodeMeta {
    pub fn new(
        name: &str,
        size: usize,
        owner: &str,
        group: &str,
        created: Option<DateTime<Utc>>,
        modified: Option<DateTime<Utc>>,
        permissions: u32,
    ) -> NodeMeta {
        let created = created.unwrap_or(default_date!());
        let modified = modified.unwrap_or(default_date!());

        Self {
            name: name.to_string(),
            size,
            owner: owner.to_string(),
            group: group.to_string(),
            created,
            modified,
            permissions,
        }
    }

    pub fn display_permissions(&self) -> &str {
        let _p = self.permissions;
        todo!()
    }
}

impl DirNode {
    pub fn new_ref(
        name: &str,
        parent: Option<NodeRef>,
        owner: &str,
        group: &str,
        permissions: u32,
    ) -> NodeRef {
        let size = DEFAULT_DIRECTORY_SIZE;
        let node = Self {
            metadata: NodeMeta::new(name, size, owner, group, None, None, permissions),
            parent: parent.as_ref().map(Rc::downgrade),
            children: HashMap::new(),
            children_vec: Vec::new(),
            aliases: Vec::new(),
        };

        let node_ref = Rc::new(RefCell::new(Node::Dir(node)));
        if let Some(parent) = parent {
            parent
                .as_ref()
                .borrow_mut()
                .as_dir_mut()
                .unwrap()
                .add_child(node_ref.clone());
        }

        node_ref
    }

    pub fn add_child(&mut self, child: NodeRef) {
        let name = child.borrow().name().to_string();
        self.children_vec.push(child.clone());
        self.children.insert(name, child);
    }

    pub fn get_child(&self, name: &str) -> Option<NodeRef> {
        self.children.get(name).cloned()
    }

    pub fn children(&self) -> &[NodeRef] {
        &self.children_vec
    }

    pub fn parent(&self) -> Option<NodeRef> {
        self.parent.as_ref()?.upgrade()
    }
}

impl FileNode {
    pub fn new_ref(name: &str, parent: NodeRef, owner: &str, group: &str, size: usize) -> NodeRef {
        let node = Self {
            metadata: NodeMeta::new(
                name,
                size,
                owner,
                group,
                None,
                None,
                Acl::DEFAULT_FILE.bits(),
            ),
            parent: Rc::downgrade(&parent),

            // TODO: this should use like a function or something
            // to generate an actual slug
            slug: name.to_string(),
        };

        let node_ref = Rc::new(RefCell::new(Node::File(node)));
        parent
            .borrow_mut()
            .as_dir_mut()
            .unwrap()
            .add_child(node_ref.clone());

        node_ref
    }

    pub fn parent(&self) -> NodeRef {
        self.parent.upgrade().unwrap()
    }
}

#[wasm_bindgen]
impl FileSystem {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let root = DirNode::new_ref(
            "/",
            None,
            ROOT_OWNER,
            ROOT_GROUP,
            Acl::OWNER_ALL.bits() | Acl::DIRECTORY.bits(),
        );
        let pwd = Self::init(root.clone());

        FileSystem { root, pwd }
    }

    fn init(root: NodeRef) -> NodeRef {
        for dir in FHS_DIRS {
            DirNode::new_ref(
                dir,
                Some(root.clone()),
                ROOT_OWNER,
                ROOT_GROUP,
                Acl::OWNER_ALL.bits() | Acl::DIRECTORY.bits(),
            );
        }

        let home = DirNode::new_ref(
            "home",
            Some(root),
            ROOT_OWNER,
            ROOT_GROUP,
            Acl::DEFAULT_FILE.bits() | Acl::DIRECTORY.bits(),
        );

        let user_path = DirNode::new_ref(
            "posts",
            Some(home),
            DEFAULT_OWNER,
            DEFAULT_GROUP,
            Acl::DEFAULT_FILE.bits() | Acl::DIRECTORY.bits(),
        );

        POST_TYPES.iter().for_each(|n| {
            DirNode::new_ref(
                n,
                Some(user_path.clone()),
                DEFAULT_OWNER,
                DEFAULT_GROUP,
                Acl::DEFAULT_FILE.bits() | Acl::DIRECTORY.bits(),
            );
        });

        user_path
    }

    pub fn get_node(&mut self, path: &str) -> Result<JsNode, JsValue> {
        match self.get_node_native(path) {
            Ok(n) => Ok(JsNode::from_node_ref(n)),
            Err(e) => Err(JsValue::from_str(&format!("{:?}", e))),
        }
    }

    pub fn list_dir(&mut self, path: &str) -> Result<js_sys::Array, JsValue> {
        let node = self
            .get_node_native(path)
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))?;
        let borrow = node.borrow();
        let dir = borrow
            .as_dir()
            .ok_or_else(|| JsValue::from_str("not a directory"))?;

        let array = js_sys::Array::new();
        for child in dir.children() {
            array.push(&JsNode::from_node_ref(child.clone()).into());
        }

        Ok(array)
    }

    pub fn pwd(&self) -> JsNode {
        JsNode::from_node_ref(self.pwd.clone())
    }
}

impl FileSystem {
    pub fn get_node_native(&mut self, path: &str) -> FsResult<NodeRef> {
        if path == "/" {
            return Ok(self.root.clone());
        }

        if path == ".." || path == "../" {
            let pwd = self.pwd.borrow();
            let dir = pwd.as_dir().unwrap();

            return Ok(dir.parent().unwrap_or_else(|| self.root.clone()));
        }

        if path == "." || path == "./" {
            return Ok(self.pwd.clone());
        }

        let mut curr = if path.starts_with("../") {
            let pwd = self.pwd.borrow();
            let dir = pwd.as_dir().unwrap();
            dir.parent().unwrap_or_else(|| self.pwd.clone())
        } else if path.starts_with("./") || !path.starts_with("/") {
            self.pwd.clone()
        } else {
            self.root.clone()
        };

        let /* mut */ parts: Vec<&str> = path.split('/').filter(|s| !s.is_empty()).collect();

        // if let Some(aliased) = path_from_alias(parts[0]) {
        //     parts = aliased.split('/').chain(parts.iter().skip(1)).collect();
        // }

        for part in parts {
            if part == "." {
                continue;
            }

            if part == ".." {
                let curr_clone = curr.clone();
                let curr_borrow = curr_clone.borrow();
                let dir = curr_borrow
                    .as_dir()
                    .ok_or(FsErr::NotDirectory(path.to_string()))?;

                curr = dir.parent().unwrap_or_else(|| curr.clone());
                continue;
            }

            let curr_borrow = curr.borrow();
            let dir = curr_borrow
                .as_dir()
                .ok_or(FsErr::NotDirectory(path.to_string()))?;

            let next = dir
                .get_child(part)
                .ok_or(FsErr::NotFound(path.to_string()))?;

            drop(curr_borrow);
            curr = next;
        }

        if !curr.borrow().can_read() {
            return Err(FsErr::NotAllowed(path.to_string()));
        }

        self.pwd = curr.clone();
        Ok(curr)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn mk_fs() -> FileSystem {
        FileSystem::new()
    }

    #[test]
    fn fs_root_creation() {
        let fs = mk_fs();
        let root = fs.root.borrow();

        assert_eq!(root.name(), "/");
    }

    #[test]
    fn fs_root_navigation() {
        let mut fs = mk_fs();
        let root = fs.get_node_native("/").unwrap();

        assert_eq!(root.borrow().name(), "/");
    }

    // #[test]
    // fn test_fs() {
    //     let home = fs.get_node("/home").unwrap();
    // }
}
