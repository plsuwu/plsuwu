import { error } from '@sveltejs/kit';
import { slugFromPath, type MdsvexResolver } from '$utils/post';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const modules = import.meta.glob(`/src/content/posts/**/*.md`);

	let match: { path?: string; resolver?: MdsvexResolver } = {};
	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === params.slug) {
			match = { path, resolver: resolver as unknown as MdsvexResolver };
			break;
		}
	}

	const post = await match?.resolver?.();
	if (!post) {
		error(404);
	}

	return {
		component: post.default,
		frontmattter: post.metadata,
	};
};
