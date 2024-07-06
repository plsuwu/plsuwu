import type { Post } from './post';
import { base } from '$app/paths';

interface Cacheable<T = any> {
	[key: string | number]: T[];
}

export let cache: Cacheable;
export let ctfs = new Set<string>();
export let tags = new Set<string>();

// does this run serverside or clientside?
// is this ok to be doing??
export let navigatedFrom: string = base;
export const setNavigatedFrom = (url: string) => {
    if (url != '/undefined') {
        navigatedFrom = url;
    } else {
        navigatedFrom = '/';
    }
}

export function setCache(data: Cacheable) {
    // omit these fields from our cached haystack array
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

    // run haystack creation (results in slightly slower first pageload
    // on the server) so we dont have to worry about haystack creation
    // every time we run a search
	cache = {
		posts: data.posts,
		haystack: haystack,
	};

    return cache;
}

export function getCache() {
	return cache;
}


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
