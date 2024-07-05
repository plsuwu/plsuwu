import { loadPosts, type Post } from './postLoader';

interface Cacheable<T = any> {
	[key: string | number]: T[];
}

export let cache: Cacheable;
export function setCache(data: Cacheable) {
    // dont add these to a post's searchterm string
	const omitted = new Set(['pub', 'slug', 'link', 'date']);
	const haystack = Object.entries(data.posts).map(([_, val]) => {
		const vals = Object.entries(val)
			.filter(([field]) => !omitted.has(field))
			.map(([_, fieldVal]) => {
				if (Array.isArray(fieldVal)) {
					return fieldVal.join(' ');
				}

				return fieldVal;
			});

		return vals.join(' ');
	});

	cache = {
		posts: data.posts,
		haystack: haystack,
	};

    return getCache();
}

export function getCache() {
	return cache;
}

export let ctfs = new Set<string>();
export let tags = new Set<string>();

export function getTocOptions() {
	// maybe refactor to allow for better generalization
	return { tags, ctfs };
}

export const pushTocOptions = (posts: Post[]) => {
	for (const post of posts) {
		ctfs.add(post.from);
		post.tags.forEach((tag) => tags.add(tag));
	}
};
