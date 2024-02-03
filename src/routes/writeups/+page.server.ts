import type { PageServerLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';
import type { MdsvexFile, BlogPost } from '$lib/types';

import { setCache, getCache } from '$lib/cache';


export const load: PageServerLoad = async () => {  // {url}
    let postArray = getCache();

    if (!postArray) {
        const modules = import.meta.glob(`/src/docs/writeups/**/*.{md,svx,svelte.md}`);
        const postPromises = Object.entries(modules).map(([path, resolver]) =>
            resolver().then(
                (post) =>
                ({
                    slug: slugFromPath(path),
                    ...(post as unknown as MdsvexFile).metadata
                } as BlogPost)
            )
        );

        const post = await Promise.all(postPromises);
        const publishedPost = post.filter((post) => post.published);
        setCache(publishedPost);

        postArray = publishedPost;
    }

    // publishedPost.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
    return { posts: postArray };
};


