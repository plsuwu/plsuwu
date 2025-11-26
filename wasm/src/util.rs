use alloc::string::String;

pub const FHS_DIRECTORIES: [&str; 14] = [
    "bin", "boot", "dev", "etc", "home", "lib", "mnt", "opt", "proc", "root", "sys", "tmp", "usr",
    "var",
];

pub const POST_CATEGORIES: [&str; 3] = [
    "ctfs",
    "reports",
    "miscellaneous",
];

pub fn get_group_from_owner(owner: &str) -> String {
    match owner {
        "root" => String::from("root"),
        _ => String::from("users"),
    }
}
