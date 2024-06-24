import type { PageServerLoad } from './$types';
import { setCache, getCache } from '$lib/utils/store';
import { getPostArray } from '$lib/utils/getPostArray';

export const load: PageServerLoad = async () => {
	let postArray = getCache();

	// if posts cannot be loaded from in-memory cache, fetch them from the
	// filesystem and push them to the cache.
	if (!postArray) {
		// glob for filenames in `src/docs` & its subdirectories - this is just metadata, post content is
		// loaded when navigated to in `../[slug]/page.ts`.
		postArray = await getPostArray();
        setCache(postArray);
	}

	return { posts: postArray };
};
