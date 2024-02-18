import type { PageServerLoad } from "./$types";
import { slugFromPath } from "$lib/slugFromPath";
import type { MdsvexFile, BlogPost } from "$lib/types";

import { setCache, getCache } from "$lib/cache";

// storing post data like this fixes the random and constant 404s
export const load: PageServerLoad = async () => {
    let postArray = getCache();

    // if posts cannot be loaded from in-memory cache, fetch them from the
    // filesystem and push them to the cache.
    if (!postArray) {
        const modules = import.meta.glob(
            `/src/docs/writeups/**/*.{md,svx,svelte.md}`,
        );
        const postPromises = Object.entries(modules).map(([path, resolver]) =>
            resolver().then(
                (post) =>
                    ({
                        slug: slugFromPath(path),
                        ...(post as unknown as MdsvexFile).metadata,
                    }) as BlogPost,
            ),
        );

        const post = await Promise.all(postPromises);
        const publishedPost = post.filter((post) => post.published);
        setCache(publishedPost);

        // after fetching & caching posts, make sure to actually assign the posts to return
        // variable before returning, else the page returns a 404 and must be reloaded again before
        // we return a truthy result for this function's check.
        postArray = publishedPost;
    }

    return { posts: postArray };
};
