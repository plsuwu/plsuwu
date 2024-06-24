import { setCache } from './store';
import type { BlogPost, MdsvexFile } from './types';
import { slugFromPath } from './utils';

export const getPostArray = async (): Promise<BlogPost[]> => {

    const modules = import.meta.glob(`/src/docs/**/*.{md,svx,svelte.md}`);
    const postPromises = Object.entries(modules).map(([path, resolver]) =>
        resolver().then(
            (post) =>
                ({
                    slug: slugFromPath(path),
                    ...(post as unknown as MdsvexFile).metadata,
                }) as BlogPost
        )
    );

    const post = await Promise.all(postPromises);
    const publishedPost = post.filter((post) => post.published);
    setCache(publishedPost);

    return publishedPost;
};
