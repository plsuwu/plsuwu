// @ts-nocheck
/* also TODO:
 * I think we should transform this into an API request so we can fetch markdown docs from
 * objects in a bucket or something - this way we are able to simply upload docs and have it
 * them available, without having to pull the entire webapp from github and rebuild everything.
*/

import type { PageServerLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';
import type { MdsvexFile, BlogPost } from '$lib/types'

const MAX_POSTS = 10;

export const load = async () => {  // {url}
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
    const publishedPost = post.filter((post) => post.published).slice(0, MAX_POSTS);

    publishedPost.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

    return { posts: publishedPost };
};
;null as any as PageServerLoad;