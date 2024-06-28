import type { PageLoad } from './$types';
import { loadPosts, type Post } from '$utils/postLoader';
import { getCache, getTocOptions, pushTocOptions, setCache } from '$utils/store';
import type { Param } from '$utils/navigation';
import { filterPosts } from '$utils/param';

// load post metadata
export const load: PageLoad = async ({ url }) => {
    let posts = getCache();
    const params: Param = {};

	if (!posts) {
		const avail = await loadPosts();
		posts = avail;
		setCache(posts);
	}


	if (url.searchParams.size > 0) {
		url.searchParams.forEach((val, key) => {
            if (val) {
			    params[key] = val;
            }
		});

		const filtered = filterPosts(posts, params);
		posts = filtered;
	}

    if (getTocOptions.length < 1) {
        const tmp = await loadPosts();
        pushTocOptions(tmp);
    }

    let tags = [...getTocOptions().tags];
    let ctfs = [...getTocOptions().ctfs];

	return { posts, params, tags, ctfs };
};
