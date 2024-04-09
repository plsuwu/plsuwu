import type { PageServerLoad } from "./$types";
import type { MdsvexFile, BlogPost } from "$lib/utils/types";
import { sleep, slugFromPath } from "$lib/utils/utils";
import { setCache, getCache } from "$lib/utils/store";


// storing post data like this fixes the random and constant 404s
export const load: PageServerLoad = async () => {
    await sleep(2000);

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

        postArray = publishedPost;
    }

    return { posts: postArray };
};
