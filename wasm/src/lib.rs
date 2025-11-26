#![no_std]

extern crate alloc;
extern crate wee_alloc;

use alloc::boxed::Box;
use alloc::rc::Rc;
use alloc::string::String;
use alloc::vec::Vec;
use core::cell::RefCell;
use wasm_bindgen::prelude::*;

mod acl;
mod fs;
mod js;
mod util;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

// #[wasm_bindgen(start)]
// pub fn main() {
//     #[cfg(feature = "console_error_panic_hook")]
//     console_error_panic_hook::set_once();
// }
