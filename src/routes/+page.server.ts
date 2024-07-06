import type { PageServerLoad } from './$types';
import { load as loadPosts } from '$utils/post';
import { setCache, getCache, pushTocOptions, getTocOptions } from '$utils/store';

export const load: PageServerLoad = async () => {
	let cache = getCache();
	if (!cache || !cache.posts || !cache.haystack) {
		const posts = await loadPosts();
		setCache({ posts: posts });
        cache = getCache();
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
