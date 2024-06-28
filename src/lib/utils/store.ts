import { loadPosts, type Post } from './postLoader';

export let cache: Post[] | null;
export function setCache(data: Post[]) {
	cache = data;
}
export function getCache() {
	return cache;
}

export let ctfs = new Set<string>();
export let tags = new Set<string>();

export function getTocOptions() {
	return { tags, ctfs };
}

export const pushTocOptions = (posts: Post[]) => {
	for (const post of posts) {
		ctfs.add(post.from);
		post.tags.forEach((tag) => tags.add(tag));
	}
};
