import { resolveSlug, type MdsvexResolver } from "$lib/content/import.svelte";
import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ params }) => {
	const modules = import.meta.glob(`/src/content/posts/**/*.md`);

	let match: { path?: string; resolver?: MdsvexResolver } = {};
	for (const [path, resolver] of Object.entries(modules)) {
		if (resolveSlug(path) === params.slug) {
			match = { path, resolver: resolver as unknown as MdsvexResolver };
			break;
		}
	}

	const post = await match?.resolver?.();
	if (!post) {
		error(404, "requested post doesn't seem to exist.");
	}

	return {
		component: post.default,
		frontmattter: post.metadata,
	};
};
