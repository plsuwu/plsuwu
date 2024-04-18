import type { BlogPost } from '$lib/utils/types';
import { writable, type Writable } from 'svelte/store';

// const sortOptions = ['date', 'name'];
// const orderOptions = ['ascending', 'descending'];

let cache: BlogPost[] | null;

export function setCache(data: BlogPost[]) {
	cache = data;
}
export function getCache() {
	return cache;
}

export const loading: Writable<boolean> = writable(false);
export const sortComplete: Writable<boolean> = writable(true);

export let imgUrlStore: Writable<string> = writable('#');
export const show: Writable<boolean> = writable(false);
