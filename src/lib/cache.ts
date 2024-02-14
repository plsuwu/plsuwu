import type { BlogPost } from '$lib/types';
import { writable, type Writable } from "svelte/store";

/*
* this file is functionally equivalent to a store.ts
*/

let cache: (BlogPost[] | null);
export function setCache(data: BlogPost[]) {
    cache = data;
}
export function getCache() {
    return cache;
}

export const show: Writable<boolean> = writable(false);
export const sortComplete: Writable<boolean> = writable(true);

// should probably be moved to types.ts, if bothered.
interface PostTag {
    name: String,
    color: String
}

export const postTags: PostTag[] = [
    { name: "capture the flag", color: "text-cat-maroon" },

    { name: "hackthebox", color: "text-cat-blue" },
    { name: "huntress", color: "text-cat-blue" },
    { name: "0x0539", color: "text-cat-blue" },
    { name: "tryhackme", color: "text-cat-blue" },

    { name: "binex", color: "text-cat-pink" },
    { name: "forensics", color: "text-cat-pink" },
    { name: "malware", color: "text-cat-pink" },
    { name: "reversing", color: "text-cat-pink" },
    { name: "obfuscation", color: "text-cat-pink" },
    { name: "web", color: "text-cat-pink" },
    { name: "networks", color: "text-cat-pink" },
];
