import type { PageLoad } from './$types';
import type { Param } from '$utils/param';
import { getCache, getTocOptions, pushTocOptions, setCache } from '$utils/store';
import { load as loadPosts } from '$utils/post';
import { filterPosts } from '$utils/param';
import { search } from '$utils/search';

// load post metadata
export const load: PageLoad = async ({ url }) => {
	let cache = getCache();
	const params: Param = {};

	if (!cache || !cache.posts || !cache.haystack) {
		const posts = await loadPosts();
		setCache({ posts: posts });
        cache = getCache();
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

        let currentPosts;
		if (postQuery != null) {
			currentPosts = search(cache.haystack, postQuery).map((res => res.post));
		} else {
            currentPosts = cache.posts;
        }

        let filtered = filterPosts(currentPosts, params);
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
