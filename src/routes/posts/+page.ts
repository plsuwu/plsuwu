import type { PageLoad } from './$types';
import { loadPosts, matchPostType, type Post } from '$utils/postLoader';
import { getCache, setCache } from '$utils/store';

// load post metadata
export const load: PageLoad = async ({ url }) => {
	let posts = getCache();

	// if we cannot find post metadata in memory, run the glob function
	if (!posts) {
		const avail = await loadPosts();
		posts = avail;
		setCache(posts);
	}

    // filter posts by their type/area (ctf, note) if the param is present in the url
	const query = url.searchParams.get('type');
	if (query) {
		const params = query;
		const filtered = matchPostType(query, posts as Post[]);

        // pass param in loaded data to display page name
		return { posts: filtered, params };
	}

	return { posts, params: undefined };
};
