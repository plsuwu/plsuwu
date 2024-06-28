import type { PageLoad } from './$types';
import { loadPosts, matchPostType, type Post } from '$utils/postLoader';
import { getCache, setCache } from '$utils/store';

export const load: PageLoad = async ({ url }) => {
    let posts = getCache();
    if (!posts) {
        const avail = await loadPosts();
        posts = avail;
        setCache(posts);
    }

    const query = url.searchParams.get('type');
    if (query) {
        const params = query;
        const filtered = matchPostType(query, posts as Post[]);
        filtered.sort((a, b) => new Date(a.date) > new Date(b.date) ? -1 : 1);
        return { posts: filtered, params };
    }

    return { posts, params: undefined };
};

