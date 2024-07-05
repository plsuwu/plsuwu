import type { PageLoad } from './$types';
import { loadPosts, type Post } from '$utils/postLoader';
import { getCache, getTocOptions, pushTocOptions, setCache } from '$utils/store';
import type { Param } from '$utils/navigation';
import { filterPosts } from '$utils/param';
import { runSearch } from '$utils/search';

// load post metadata
export const load: PageLoad = async ({ url }) => {
	let cache = getCache();
	const params: Param = {};

	if (!cache) {
		const posts = await loadPosts();
		// console.log({ posts: posts })
		cache = { posts: posts };
		setCache(cache);
	}

	let postQuery: string | null = null;

	if (url.searchParams.size > 0) {
		url.searchParams.forEach((val, key) => {
			if (val) {
				if (key == 's') {
					postQuery = val;
				} else {
					params[key] = val;
				}
			}
		});

		let filtered = filterPosts(cache.posts, params);


        // how the fuck......
		if (postQuery !== null) {
			const searchResult = runSearch(cache.haystack, postQuery);

			console.log(searchResult);
		}

		cache = { posts: filtered };
	}

	if (getTocOptions.length < 1) {
		const tmp = await loadPosts();
		pushTocOptions(tmp);
	}

	let tags = [...getTocOptions().tags];
	let ctfs = [...getTocOptions().ctfs];

	return { posts: cache.posts, params, tags, ctfs };
};
