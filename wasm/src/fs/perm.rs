use bitflags::bitflags;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

bitflags! {
    #[wasm_bindgen]
    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
    pub struct Acl: u32 {
        const OWNER_READ    = 0b0100000000;
        const OWNER_WRITE   = 0b0010000000;
        const OWNER_EXECUTE = 0b0001000000;
        const GROUP_READ    = 0b0000100000;
        const GROUP_WRITE   = 0b0000010000;
        const GROUP_EXECUTE = 0b0000001000;
        const OTHER_READ    = 0b0000000100;
        const OTHER_WRITE   = 0b0000000010;
        const OTHER_EXECUTE = 0b0000000001;
        const DIRECTORY     = 0b1000000000;

        const OWNER_ALL = Self::OWNER_READ.bits() | Self::OWNER_WRITE.bits() | Self::OWNER_EXECUTE.bits();
        const GROUP_ALL = Self::GROUP_READ.bits() | Self::GROUP_WRITE.bits() | Self::GROUP_EXECUTE.bits();
        const OTHER_ALL = Self::OTHER_READ.bits() | Self::OTHER_WRITE.bits() | Self::OTHER_EXECUTE.bits();
        const DEFAULT_FILE = Self::OWNER_READ.bits() | Self::OWNER_WRITE.bits() | Self::OWNER_EXECUTE.bits()
                           | Self::GROUP_READ.bits() | Self::GROUP_EXECUTE.bits()
                           | Self::OTHER_READ.bits() | Self::OTHER_EXECUTE.bits();

        const DEFAULT_DIR = Self::DEFAULT_FILE.bits() | Self::DIRECTORY.bits();
    }
}

#[wasm_bindgen]
impl Acl {
    #[wasm_bindgen]
    pub fn display(&self) -> String {
        const PERMS: [(Acl, char); 9] = [
            (Acl::OWNER_READ, 'r'),
            (Acl::OWNER_WRITE, 'w'),
            (Acl::OWNER_EXECUTE, 'x'),
            (Acl::GROUP_READ, 'r'),
            (Acl::GROUP_WRITE, 'w'),
            (Acl::GROUP_EXECUTE, 'x'),
            (Acl::OTHER_READ, 'r'),
            (Acl::OTHER_WRITE, 'w'),
            (Acl::OTHER_EXECUTE, 'x'),
        ];

        std::iter::once(if self.contains(Self::DIRECTORY) {
            'd'
        } else {
            '-'
        })
        .chain(
            PERMS
                .iter()
                .map(|(flag, ch)| if self.contains(*flag) { *ch } else { '-' }),
        )
        .collect()
    }

    #[wasm_bindgen]
    pub fn from_u32(value: u32) -> Self {
        Self::from_bits_retain(value)
    }

    #[wasm_bindgen]
    pub fn from_octal(mode: u16) -> Self {
        const PERMS: [Acl; 9] = [
            Acl::OWNER_READ,
            Acl::OWNER_WRITE,
            Acl::OWNER_EXECUTE,
            Acl::GROUP_READ,
            Acl::GROUP_WRITE,
            Acl::GROUP_EXECUTE,
            Acl::OTHER_READ,
            Acl::OTHER_WRITE,
            Acl::OTHER_EXECUTE,
        ];

        (0..3)
            .flat_map(|group| {
                let octal_digit = (mode >> (6 - group * 3)) & 0o7;
                (0..3).filter_map(move |bit| {
                    ((octal_digit >> (2 - bit)) & 1 == 1).then_some(PERMS[group * 3 + bit])
                })
            })
            .fold(Self::empty(), |acc, perm| acc | perm)
    }
}

impl std::fmt::Display for Acl {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.display())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_acl() {
        let perms = Acl::DEFAULT_FILE;
        println!("{}", perms);
    }
}
