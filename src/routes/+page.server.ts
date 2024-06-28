import type { PageServerLoad } from './$types';
import { loadPosts } from '$utils/postLoader';
import { setCache, getCache, pushTocOptions, getTocOptions } from '$utils/store';

export const load: PageServerLoad = async () => {
	let posts = getCache();

	if (!posts) {
		const avail = await loadPosts();
		posts = avail;
		setCache(posts);
	}


    if (getTocOptions.length < 1) {
        const tmp = await loadPosts();
        pushTocOptions(tmp);
    }

    let tags = [...getTocOptions().tags];
    let ctfs = [...getTocOptions().ctfs];

	return { posts, tags, ctfs };
};
