use alloc::format;
use alloc::string::String;
use wasm_bindgen::prelude::*;

use crate::fs::{FileSystem, SerializableNode};

#[wasm_bindgen]
pub struct WasmFs {
    fs: FileSystem,
}

#[wasm_bindgen]
impl WasmFs {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self::default()
    }

    #[wasm_bindgen(js_name = getNode)]
    pub fn get_node(&mut self, path: &str) -> Result<JsValue, JsValue> {
        match self.fs.get_node(path) {
            Ok(node) => {
                let info = SerializableNode::from_node(node);
                Ok(serde_wasm_bindgen::to_value(&info)?)
            }
            Err(err) => Err(JsValue::from_str(&format!(
                "error while retrieving node: {:?}",
                err
            ))),
        }
    }

    #[wasm_bindgen(js_name = listDir)]
    pub fn list_dir(&self, path: &str) -> Result<JsValue, JsValue> {
        let items = if path.is_empty() {
            let pwd = &self.fs.pwd;
            let borrow = pwd.borrow();
            let path = borrow.name();
            self.fs.list_dir(path)
        } else {
            self.fs.list_dir(path)
        };

        Ok(serde_wasm_bindgen::to_value(&items)?)
    }

    #[wasm_bindgen(js_name = getPwd)]
    pub fn get_pwd(&self) -> String {
        let pwd = self.fs.pwd.clone();

        pwd.borrow().get_canonical_path()
    }

    #[wasm_bindgen(js_name = changeDir)]
    pub fn change_dir(&mut self, path: &str) -> Result<(), JsValue> {
        let res = self.fs.set_pwd(path);
        match res {
            Ok(_) => Ok(()),
            Err(err) => Err(JsValue::from_str(&format!("{:?}", err))),
        }
    }
}

impl Default for WasmFs {
    fn default() -> Self {
        Self {
            fs: FileSystem::new(),
        }
    }
}
