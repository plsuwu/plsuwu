/* TODO: combine into a store so we don't do another load on the writeups page;
 * ideally we load the posts, store them, and then take a slice for the number of desired posts, instead of
 * loading all posts and slicing.
 *
 * i dont think its a big deal right now but it could be really annoying in the future.
*/

import type { PageServerLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';
import type { MdsvexFile, BlogPost } from '$lib/types'

const MAX_POSTS = 3;

export const load: PageServerLoad = async () => {  // {url}
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
    post.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
    const publishedPost = post.filter((post) => post.published).slice(0, MAX_POSTS);

    return { posts: publishedPost };
};
