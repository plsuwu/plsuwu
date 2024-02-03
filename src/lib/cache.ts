import { writable } from 'svelte/store';
import type { BlogPost } from '$lib/types';

let cache: (BlogPost[] | null);

export function setCache(data: BlogPost[]) {
    //console.log(data);
    cache = data;
}
export function getCache() {
    return cache;
}

export const sortComplete = writable<boolean>(true);

export const postTags = [
    "capture the flag",
    "huntress",
    "hackthebox",
    "0x0539",
    "tryhackme",
    "binex",
    "forensics",
    "malware",
    "reversing",
    "obfuscation",
    "web",
    "networks"
];
