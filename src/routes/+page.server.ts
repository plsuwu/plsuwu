import type { PageServerLoad } from './$types';
import { loadPosts } from '$utils/postLoader';
import { setCache, getCache } from '$utils/store';

export const load: PageServerLoad = async () => {
    let posts = getCache();
    if (!posts) {
        const avail = await loadPosts();
        posts = avail;
        setCache(posts);
    }

    return { posts }
}
