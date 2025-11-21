use thiserror::Error;
use wasm_bindgen::prelude::*;

pub const NOT_FOUND: &str = "no such file or directory";
pub const NOT_DIRECTORY: &str = "not a directory";
pub const NOT_ALLOWED: &str = "permission denied";

#[allow(clippy::enum_variant_names)]
#[derive(Debug, Error)]
pub enum FsErr {
    #[error("no such file or directory: '{0}'")]
    NotFound(String),

    #[error("not a directory: '{0}'")]
    NotDirectory(String),

    #[error("permission denied: '{0}'")]
    NotAllowed(String),
}

#[wasm_bindgen]
pub struct FsError {
    message: String,
}

#[wasm_bindgen]
impl FsError {
    pub fn message(&self) -> String {
        self.message.clone()
    }
}

impl From<FsErr> for FsError {
    fn from(value: FsErr) -> Self {
        FsError {
            message: format!("{:?}", value),
        }
    }
}
