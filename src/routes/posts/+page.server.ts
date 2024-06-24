import type { PageServerLoad } from './$types';
import { setCache, getCache } from '$lib/utils/store';
import { getPostArray } from '$lib/utils/getPostArray';

export const load: PageServerLoad = async () => {
	let postArray = getCache();

	// should be in memory by this point.
	if (!postArray) {
		postArray = await getPostArray();
        setCache(postArray);
	}

	return { posts: postArray };
};
