import { loadPosts, type Post } from './postLoader';

export let cache: Post[] | null;
export function setCache(data: Post[]) {
	cache = data;
}
export function getCache() {
	return cache;
}
