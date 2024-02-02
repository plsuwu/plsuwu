import type { PageServerLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';
import type { MdsvexFile, BlogPost } from '$lib/types';

import { setCache, getCache } from '$lib/cache';

/*
* stores posts in a serverside cache instead of globbing for posts on each page load
*  --> i dont actually think this is more efficient and at this point it feels like its
*       better to just do SQL queries.
*/

export const load: PageServerLoad = async () => {  // {url}
    let postArray = getCache();

    if (!postArray) {
        const modules = import.meta.glob(`/src/docs/*/**/*.{md,svx,svelte.md}`);
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

        // if postArray is empty, make sure to give it the array of posts,
        // else the page must be reloaded again before we return a truthy postArray.
        postArray = publishedPost;
    }

    return { posts: postArray };
};
