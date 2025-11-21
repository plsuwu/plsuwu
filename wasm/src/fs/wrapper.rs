use wasm_bindgen::prelude::*;

use super::node;
use super::perm::Acl;

#[wasm_bindgen]
pub struct JsNode {
    inner: node::NodeRef,
}

#[wasm_bindgen]
impl JsNode {
    pub fn name(&self) -> String {
        self.inner.borrow().name().to_string()
    }

    pub fn is_dir(&self) -> bool {
        self.inner.borrow().is_dir()
    }

    pub fn size(&self) -> usize {
        match &*self.inner.borrow() {
            node::Node::Dir(d) => d.metadata.size,
            node::Node::File(f) => f.metadata.size,
        }
    }

    pub fn metadata(&self) -> JsValue {
        let node = self.inner.borrow();
        let meta = match &*node {
            node::Node::Dir(d) => &d.metadata,
            node::Node::File(f) => &f.metadata,
        };

        serde_wasm_bindgen::to_value(&serde_json::json!({
            "name": meta.name,
            "size": meta.size,
            "owner": meta.owner,
            "group": meta.group,
            "permissions": Acl::from_u32(meta.permissions).display()
        }))
        .unwrap()
    }

    pub fn created_timestamp(&self) -> f64 {
        let node = self.inner.borrow();
        let meta = match &*node {
            node::Node::Dir(d) => &d.metadata,
            node::Node::File(f) => &f.metadata,
        };

        meta.created.timestamp() as _
    }
}

impl JsNode {
    pub(crate) fn from_node_ref(inner: node::NodeRef) -> Self {
        Self { inner }
    }
}
