import type { Param } from './navigation';

export interface MdsvexFile {
	default: import('svelte').SvelteComponent;
	metadata: Record<string, string | string[]>;
}

export type MdsvexResolver = () => Promise<MdsvexFile>;

/** Below `Post` interface mirrors the frontmatter, eg:
 * ---
 * title: 'post title'
 * link: 'https://url.to/ctf/challenge.html'
 * description: 'an example of the expected frontmatter'
 * from: 'ctf site'
 * date: '1719488654'
 * type: 'ctf'
 * tags: ['web', 'tag 2', 'tag 4']
 * ---
 */
export interface Post {
	slug: string;   // url slug
    pub: boolean;   // is the post 'public' or not
	title: string;
	description: string;
	from: string;   // name of a website that a post references
	date: string;   // date of original post
	type: string;
	tags: string[];
}

export const slugFromPath = (path: string) => {
	return path.match(/([\w-]+)\.(md)/i)?.[1] ?? null;
};

/**
 * Loads post metadata from the markdown YAML frontmatter
 * @async
 * @returns {Promise<Post[]>} Array of `Post` metadata as a promise, sorted by date (newest first)
 */
export const loadPosts = async (): Promise<Post[]> => {
	const modules = import.meta.glob(`/src/content/posts/**/*.md`);

	const postsPromise = Object.entries(modules).map(async ([path, resolver]) =>
		resolver().then(
			(post) =>
				({
					slug: slugFromPath(path),
					...(post as unknown as MdsvexFile).metadata,
				}) as Post
		)
	);

	const postResolved = await Promise.all(postsPromise);
	const sorted = postResolved.filter((post) =>  post.pub).sort(
		(a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1) // replace with a modular sorting func
	);

	return sorted;
};
