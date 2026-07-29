import { getCollection } from "astro:content";
import { getTimestampParts } from "./utils";

/**
 * i believe astro resolves this stuff at build time, but this should speed up build
 * times very slightly as posts increase...
 *
 * ... or i imagine it does
 */
let cache: any[] | null = null;

export async function getProcessedPosts() {
	if (cache) {
		return cache;
	}

	const posts = await getCollection("posts");
	cache = posts
		.map((post) => {
			const ts = getTimestampParts(post.data.created_at);
			return {
				...post,
				params: {
					day: String(ts.day),
					month: String(ts.month),
					year: String(ts.year),
				},
			};
		})
		.sort(
			(a, b) => b.data.created_at.valueOf() - a.data.created_at.valueOf()
		);

	return cache;
}
