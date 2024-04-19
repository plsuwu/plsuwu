import type { PageServerLoad } from './$types';
import type { MdsvexFile, BlogPost } from '$lib/utils/types';
import { slugFromPath } from '$lib/utils/utils';
import { setCache, getCache } from '$lib/utils/store';

export const load: PageServerLoad = async () => {
	let postArray = getCache();

	// if posts cannot be loaded from in-memory cache, fetch them from the
	// filesystem and push them to the cache.
	if (!postArray) {
		// glob for filenames in `src/docs` & its subdirectories - this is just metadata, post content is
		// loaded when navigated to in `../[slug]/page.ts`.
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

		postArray = publishedPost;
	}

	return { posts: postArray };
};
