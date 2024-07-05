import type { PageServerLoad } from './$types';
import { loadPosts } from '$utils/postLoader';
import { setCache, getCache, pushTocOptions, getTocOptions } from '$utils/store';

export const load: PageServerLoad = async () => {
	let cache = getCache();
	if (!cache) {
		const posts = await loadPosts();
		cache = { posts: posts };
		setCache(cache);
	}

    if (getTocOptions.length < 1) {
        const tmp = await loadPosts();
        pushTocOptions(tmp);
    }

    let tags = [...getTocOptions().tags];
    let ctfs = [...getTocOptions().ctfs];
    const posts = cache.posts;
    getCache();

	return { posts, tags, ctfs };
};
