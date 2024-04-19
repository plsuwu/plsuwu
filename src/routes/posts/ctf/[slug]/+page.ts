import { error } from '@sveltejs/kit';
import { slugFromPath } from '$lib/utils/utils';
import type { PageLoad } from './$types';
import type { MdsvexResolver } from '$lib/utils/types';

export const load: PageLoad = async ({ params }) => {
	const modules = import.meta.glob(`/src/docs/**/*.{md,svx,svelte.md}`);

	let match: { path?: string; resolver?: MdsvexResolver } = {};
	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === params.slug) {
			match = { path, resolver: resolver as unknown as MdsvexResolver };
			break;
		}
	}

	const post = await match?.resolver?.();

	if (!post || !post.metadata.published) {
		error(404);
	}
	return {
		component: post.default,
		frontmatter: post.metadata,
	};
};
