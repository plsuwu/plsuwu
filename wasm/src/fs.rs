#![allow(
    dead_code,
    clippy::enum_variant_names,
    unused_assignments,
    clippy::new_ret_no_self
)]

use alloc::collections::BTreeMap;
use alloc::rc::{Rc, Weak};
use alloc::string::String;
use alloc::vec::Vec;
use core::cell::RefCell;
use serde::{Deserialize, Serialize};
use std::ops::Deref;
use wasm_bindgen::prelude::*;

use crate::acl::{self, Acl};
use crate::util::{FHS_DIRECTORIES, POST_CATEGORIES, get_group_from_owner};

pub type NodeRef = Rc<RefCell<TreeNode>>;
pub type WeakNodeRef = Weak<RefCell<TreeNode>>;
pub type ChildNodeList = alloc::vec::Vec<SerializableNode>;
pub type Timestamp = u64;

pub type FsResult<T> = core::result::Result<T, FailReason>;

#[derive(Debug, Clone, Copy)]
pub enum FailReason {
    NotFound,
    NotDirectory,
    NotAllowed,
}

#[derive(Debug, Clone)]
pub enum TreeNode {
    Directory(DirectoryNode),
    File(FileNode),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[wasm_bindgen]
pub struct SerializableNode {
    #[wasm_bindgen(getter_with_clone)]
    pub name: String,

    #[wasm_bindgen(getter_with_clone)]
    pub permissions: String,

    #[wasm_bindgen(getter_with_clone)]
    pub owner: String,

    #[wasm_bindgen(getter_with_clone)]
    pub group: String,
    pub created: usize,
    pub modified: usize,
    pub is_dir: bool,
    pub size: usize,
    pub links: usize,
}

// #[wasm_bindgen]
// impl SerializableNode {}

impl SerializableNode {
    pub fn from_node(node_ref: NodeRef) -> Self {
        let node = node_ref.borrow().clone();

        Self {
            name: String::from(node.name()),
            permissions: Acl::display(node.permissions()),
            owner: String::from(node.owner()),
            group: String::from(node.group()),
            created: node.created() as _,
            modified: node.modified() as _,
            is_dir: node.is_dir(),
            size: node.size(),
            links: 0,
        }
    }
}

#[derive(Debug, Clone)]
pub struct NodeMetadata {
    pub name: String,
    pub permissions: u32,
    pub owner: String,
    pub group: String,
    pub created: Timestamp,
    pub modified: Timestamp,
}

#[derive(Debug, Clone)]
pub struct DirectoryNode {
    metadata: NodeMetadata,
    parent: Option<WeakNodeRef>,
    children: BTreeMap<String, NodeRef>,
}

#[derive(Debug, Clone)]
pub struct FileNode {
    metadata: NodeMetadata,
    parent: WeakNodeRef,
    size: usize,
}

#[derive(Debug, Clone)]
pub struct FileSystem {
    pub root: NodeRef,
    pub pwd: NodeRef,
    pub aliases: BTreeMap<String, NodeRef>,
}

impl TreeNode {
    pub fn name(&self) -> &str {
        match self {
            TreeNode::Directory(n) => &n.metadata.name,
            TreeNode::File(n) => &n.metadata.name,
        }
    }

    pub fn owner(&self) -> &str {
        match self {
            TreeNode::Directory(n) => &n.metadata.owner,
            TreeNode::File(f) => &f.metadata.owner,
        }
    }

    pub fn group(&self) -> &str {
        match self {
            TreeNode::Directory(n) => &n.metadata.group,
            TreeNode::File(f) => &f.metadata.group,
        }
    }

    pub fn permissions(&self) -> u32 {
        match self {
            TreeNode::Directory(n) => n.metadata.permissions,
            TreeNode::File(n) => n.metadata.permissions,
        }
    }

    pub fn can_read(&self) -> bool {
        // TODO: improve this a bit i think...
        self.permissions() & (acl::Acl::grp_r() | acl::Acl::own_r() | acl::Acl::oth_r()) != 0
    }

    pub fn is_dir(&self) -> bool {
        matches!(self, TreeNode::Directory(_))
    }

    pub fn as_dir(&self) -> Option<&DirectoryNode> {
        match self {
            TreeNode::Directory(n) => Some(n),
            _ => None,
        }
    }

    pub fn as_dir_mut(&mut self) -> Option<&mut DirectoryNode> {
        match self {
            TreeNode::Directory(n) => Some(n),
            _ => None,
        }
    }

    pub fn created(&self) -> u64 {
        match self {
            TreeNode::Directory(n) => n.metadata.created,
            TreeNode::File(n) => n.metadata.created,
        }
    }

    pub fn modified(&self) -> u64 {
        match self {
            TreeNode::Directory(n) => n.metadata.modified,
            TreeNode::File(n) => n.metadata.modified,
        }
    }

    pub fn size(&self) -> usize {
        match self {
            TreeNode::Directory(_) => 4096,
            TreeNode::File(_) => 0,
        }
    }

    pub fn get_canonical_path(&self) -> String {
        let mut parts = Vec::new();
        let mut curr = self.clone();

        loop {

            let name = curr.name();
            parts.push(name.to_string());
            if name == "/" {
                break;
            }

            match curr {
                TreeNode::Directory(ref d) => {
                    if let Some(parent_ref) = d.parent() {
                        curr = parent_ref.borrow().clone();
                    } else {
                        break;
                    }
                }
                TreeNode::File(ref f) => {
                    if let Some(parent_ref) = f.parent() {
                        curr = parent_ref.borrow().clone();
                    } else {
                        break;
                    }
                }
            }
        }

        parts.reverse();
        let mut path = String::new();
        for (i, part) in parts.iter().enumerate() {
            if i > 0 {
                path.push('/');
            }
            path.push_str(part);
        }

        path
    }
}

impl DirectoryNode {
    pub fn new(
        name: &str,
        created: Timestamp,
        parent: Option<NodeRef>,
        owner: &str,
        permissions: u32,
    ) -> NodeRef {
        let group = get_group_from_owner(owner);
        let dir = DirectoryNode {
            metadata: NodeMetadata {
                name: String::from(name),
                permissions,
                owner: String::from(owner),
                group,
                created,
                modified: created,
            },
            parent: parent.as_ref().map(Rc::downgrade),
            children: BTreeMap::new(),
        };

        let node_ref = Rc::new(RefCell::new(TreeNode::Directory(dir)));
        if let Some(parent) = parent {
            parent
                .borrow_mut()
                .as_dir_mut()
                .unwrap()
                .add_child(node_ref.clone());
        }

        node_ref
    }

    pub fn add_child(&mut self, child: NodeRef) {
        let name = child.borrow().name().into();
        self.children.insert(name, child);
    }

    pub fn get_child(&self, name: &str) -> Option<NodeRef> {
        self.children.get(name).cloned()
    }

    pub fn parent(&self) -> Option<NodeRef> {
        self.parent.as_ref()?.upgrade()
    }
}

impl FileNode {
    pub fn new(
        name: &str,
        created: Timestamp,
        parent: NodeRef,
        size: usize,
        owner: String,
        permissions: u32,
    ) -> NodeRef {
        let group = get_group_from_owner(&owner);
        let file = FileNode {
            metadata: NodeMetadata {
                name: String::from(name),
                permissions,
                owner,
                group,
                created,
                modified: created,
            },
            parent: Rc::downgrade(&parent),
            size,
        };

        let node_ref = Rc::new(RefCell::new(TreeNode::File(file)));
        parent
            .borrow_mut()
            .as_dir_mut()
            .unwrap()
            .add_child(node_ref.clone());

        node_ref
    }

    pub fn parent(&self) -> Option<NodeRef> {
        self.parent.upgrade()
    }
}

impl FileSystem {
    pub fn new() -> Self {
        let root = DirectoryNode::new("/", 0, None, "root", Acl::prv_dir());
        let mut aliases = BTreeMap::new();

        let pwd = Self::init_dir_tree(root.clone(), &mut aliases);

        Self { root, pwd, aliases }
    }

    pub fn init_dir_tree(root_node: NodeRef, aliases: &mut BTreeMap<String, NodeRef>) -> NodeRef {
        FHS_DIRECTORIES.iter().for_each(|dir| {
            DirectoryNode::new(dir, 0, Some(root_node.clone()), "root", Acl::prv_dir());
        });

        let home = root_node
            .borrow()
            .as_dir()
            .unwrap()
            .get_child("home")
            .unwrap();

        let user_dir =
            DirectoryNode::new("please", 0, Some(home.clone()), "please", Acl::def_dir());

        let posts_dir =
            DirectoryNode::new("posts", 0, Some(user_dir.clone()), "please", Acl::def_dir());

        POST_CATEGORIES.iter().for_each(|cat| {
            DirectoryNode::new(cat, 0, Some(posts_dir.clone()), "please", Acl::def_dir());
        });

        aliases.insert(String::from("~"), user_dir.clone());
        user_dir
    }

    pub fn list_dir(&self, path: &str) -> ChildNodeList {
        let mut output = Vec::new();

        if let Ok(node_weak) = self.get_node(path) {
            let node_ref = node_weak.borrow().clone();
            let node = node_ref.as_dir().unwrap();

            output = node
                .children
                .clone()
                .iter()
                .map(|child| SerializableNode::from(child.1.clone()))
                .collect::<ChildNodeList>();
        }

        // println!("{:#?}", output);
        output
    }

    pub fn set_pwd(&mut self, path: &str) -> FsResult<()> {
        if let Ok(node) = self.get_node(path) {
            self.pwd = node;
        }

        Ok(())
    }

    pub fn get_node(&self, path: &str) -> FsResult<NodeRef> {
        // path is the root node
        if path == "/" {
            return Ok(self.root.clone());
        }

        // path is parent of `self.pwd`
        if path == ".." || path == "./" {
            let pwd_borrow = self.pwd.borrow();
            let dir = pwd_borrow.as_dir().unwrap();

            return Ok(dir.parent().unwrap_or_else(|| self.root.clone()));
        }

        // path is the current node
        if path == "." || path == "./" {
            return Ok(self.pwd.clone());
        }

        // otherwise, determine which node we should start
        // traversal from
        let mut curr = if path.starts_with("../") {
            let pwd_borrow = self.pwd.borrow();
            let dir = pwd_borrow.as_dir().unwrap();
            dir.parent().unwrap_or_else(|| self.pwd.clone())
        } else if !path.starts_with('/') {
            self.pwd.clone()
        } else {
            self.root.clone()
        };
        
        // vec of node names from path string
        let mut parts: Vec<&str> = path.split('/').filter(|s| !s.is_empty()).collect();
        if let Some(alias) = self.aliases.get(parts[0]) {
            parts.remove(0);
            curr = alias.clone();
        }

        for (idx, &part) in parts.iter().enumerate() {
            // TODO: make a test for these cases - i think '.' & '..' are handled by
            // the initial base cases, so they are potentially not necessary (make a
            // test for these edge cases).
            if part == "." {
                continue;
            }
            
            // TODO: see above
            if part == ".." {
                let curr_ref = curr.borrow().clone();
                curr = curr_ref.as_dir().unwrap().parent().unwrap_or(curr);
                continue;
            }

            let curr_ref = curr.borrow().clone();
            let next = curr_ref
                .as_dir()
                .unwrap()
                .get_child(part)
                .ok_or(FailReason::NotFound)?;

            if !next.borrow().can_read() {
                return Err(FailReason::NotAllowed);
            }

            if !next.borrow().is_dir() && idx < parts.len() - 1 {
                return Err(FailReason::NotDirectory);
            }

            curr = next;
        }

        Ok(curr)
    }

    fn get_parent(node: NodeRef) -> NodeRef {
        let parent_ref = node.borrow().clone();

        parent_ref
            .as_dir()
            .unwrap()
            .parent()
            .unwrap_or(node.clone())
    }
}

impl From<NodeRef> for SerializableNode {
    fn from(node: NodeRef) -> Self {
        let node_borrow = node.borrow();
        let metadata = node_borrow.as_dir().unwrap().metadata.clone();

        Self {
            name: metadata.name,
            permissions: Acl::display(metadata.permissions),
            owner: metadata.owner,
            group: metadata.group,
            created: metadata.created as _,
            modified: metadata.modified as _,
            size: 0,
            links: 0,
            is_dir: Acl::contains_bit(metadata.permissions, Acl::dir()),
        }
    }
}

// impl SerializableNode {
//     pub fn verbose() -> {
//
//     }
// }

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn node_retrieval() {
        let fs = FileSystem::new();
        let aliased_home = fs.get_node("~/posts/ctf");
        // println!("{:#?}", aliased_home);

        fs.list_dir("/home/please");
    }

    #[test]
    fn fs_initialization() {
        let fs = FileSystem::new();

        let pwd_ref = fs.pwd.borrow().clone();
        let pwd = pwd_ref.as_dir().unwrap().metadata.clone();

        assert_eq!(&pwd.name, "please");
        assert_eq!(&pwd.owner, "please");
        assert_eq!(&pwd.group, "users");
        assert_eq!(pwd.modified, 0);
        assert_eq!(pwd.created, 0);
        assert_eq!(pwd.permissions, Acl::def_dir());

        assert!(!pwd_ref.as_dir().unwrap().children.is_empty());

        let parent_ref = pwd_ref.as_dir().unwrap().parent().unwrap().borrow().clone();
        let parent = parent_ref.as_dir().unwrap().metadata.clone();

        assert_eq!(&parent.name, "home");
        assert_eq!(&parent.owner, "root");
        assert_eq!(&parent.group, "root");
        assert_eq!(parent.created, 0);
        assert_eq!(parent.modified, 0);
        assert_eq!(parent.permissions, Acl::prv_dir());

        let home_alias_ref = fs.aliases.get("~").unwrap().borrow().clone();
        let home_alias = home_alias_ref.as_dir().unwrap().metadata.clone();

        assert_eq!(&home_alias.name, "please");
    }
}
