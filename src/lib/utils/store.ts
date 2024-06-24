import type { BlogPost } from '$lib/utils/types';
import { writable, type Writable } from 'svelte/store';

let cache: BlogPost[] | null;

export function setCache(data: BlogPost[]) {
	cache = data;
}
export function getCache() {
	return cache;
}

export const loading: Writable<boolean> = writable(false);
export const sortComplete: Writable<boolean> = writable(true);
export const show: Writable<boolean> = writable(false);

// debug thing if i recall correctly
export let imgUrlStore: Writable<string> = writable('#');
