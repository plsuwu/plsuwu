import type { PageServerLoad } from './$types';
import { getCache, setCache } from '$lib/utils/store';
import { getPostArray } from '$lib/utils/getPostArray';

export const load: PageServerLoad = async () => {
    // not used yet
	let postArray = getCache();
	if (!postArray) {
        postArray = await getPostArray();
        setCache(postArray);
	}

    const ctfPost = postArray.filter((post) => post.area === 'ctf');
	return { posts: ctfPost };
};

