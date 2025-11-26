#![allow(dead_code)]

use alloc::string::String;

const FLAG_OWNER_R: u32 = 0b0100000000;
const FLAG_OWNER_W: u32 = 0b0010000000;
const FLAG_OWNER_X: u32 = 0b0001000000;

const FLAG_GROUP_R: u32 = 0b0000100000;
const FLAG_GROUP_W: u32 = 0b0000010000;
const FLAG_GROUP_X: u32 = 0b0000001000;

const FLAG_OTHER_R: u32 = 0b0000000100;
const FLAG_OTHER_W: u32 = 0b0000000010;
const FLAG_OTHER_X: u32 = 0b0000000001;

const FLAG_DIRECTORY: u32 = 0b100000000;

const DEF_ACCESS_FILE: u32 = FLAG_OWNER_R
    | FLAG_OWNER_W
    | FLAG_OWNER_X
    | FLAG_GROUP_R
    | FLAG_GROUP_X
    | FLAG_OTHER_R
    | FLAG_OTHER_X;

const PRV_ACCESS_FILE: u32 = FLAG_OWNER_R | FLAG_OWNER_W | FLAG_OWNER_X;

pub struct Acl;
impl Acl {
    pub const fn own_r() -> u32 {
        FLAG_OWNER_R
    }
    pub const fn own_w() -> u32 {
        FLAG_OWNER_W
    }
    pub const fn own_x() -> u32 {
        FLAG_OWNER_X
    }
    pub const fn grp_r() -> u32 {
        FLAG_GROUP_R
    }
    pub const fn grp_w() -> u32 {
        FLAG_GROUP_W
    }
    pub const fn grp_x() -> u32 {
        FLAG_GROUP_X
    }
    pub const fn oth_r() -> u32 {
        FLAG_OTHER_R
    }
    pub const fn oth_w() -> u32 {
        FLAG_OTHER_W
    }
    pub const fn oth_x() -> u32 {
        FLAG_OTHER_X
    }
    pub const fn dir() -> u32 {
        FLAG_DIRECTORY
    }
    pub const fn def_file() -> u32 {
        DEF_ACCESS_FILE
    }
    pub const fn prv_file() -> u32 {
        PRV_ACCESS_FILE
    }
    pub const fn def_dir() -> u32 {
        DEF_ACCESS_FILE | FLAG_DIRECTORY
    }
    pub const fn prv_dir() -> u32 {
        PRV_ACCESS_FILE | FLAG_DIRECTORY
    }

    pub fn contains_bit(val: u32, mask: u32) -> bool {
        val & mask > 0
    }

    pub fn display(bf: u32) -> String {
        const ACL_BITMAP: [(u32, char); 9] = [
            (Acl::own_r(), 'r'),
            (Acl::own_w(), 'w'),
            (Acl::own_x(), 'x'),
            (Acl::grp_r(), 'r'),
            (Acl::grp_w(), 'w'),
            (Acl::grp_x(), 'x'),
            (Acl::oth_r(), 'r'),
            (Acl::oth_w(), 'w'),
            (Acl::oth_x(), 'x'),
        ];

        core::iter::once(if Acl::contains_bit(bf, Acl::dir()) {
            'd'
        } else {
            '-'
        })
        .chain(
            ACL_BITMAP
                .iter()
                .map(|(f, ch)| if Acl::contains_bit(bf, *f) { *ch } else { '-' }),
        )
        .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_display() {
        let test_acl_dir = Acl::prv_dir();
        let test_acl_file = Acl::def_file();

        let display_dir = Acl::display(test_acl_dir);
        let display_file = Acl::display(test_acl_file);

        assert_eq!(display_dir, "drwx------");
        assert_eq!(display_file, "drwxr-xr-x");
    }

    #[test]
    fn test_contains_fn() {
        let test_acl = Acl::own_r() | Acl::own_x();

        let expects_true = Acl::contains_bit(test_acl, Acl::own_r());
        let expects_false = Acl::contains_bit(test_acl, Acl::oth_r());

        assert!(expects_true);
        assert!(!expects_false);

        let expects_true = Acl::contains_bit(test_acl, Acl::own_x());
        let expects_false = Acl::contains_bit(test_acl, Acl::own_w());

        assert!(expects_true);
        assert!(!expects_false);

        let expects_true = Acl::contains_bit(test_acl, Acl::own_r() | Acl::own_x());
        let expects_false = Acl::contains_bit(test_acl, Acl::own_w() | Acl::oth_x());

        assert!(expects_true);
        assert!(!expects_false);
    }
}
