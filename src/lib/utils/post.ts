export type MdsvexResolver = () => Promise<MdsvexFile>;
export interface Post {
	slug: string;
    pub: boolean;
	title: string;
	description: string;
	from: string;
	date: string;
	type: string;
	tags: string[];
}

export const truncate = (text: string, length: number = 138): string => {
    return text.length > length ? text.slice(0, length - 4).trimEnd() + '...' : text;
}

export interface MdsvexFile {
	default: import('svelte').SvelteComponent;
	metadata: Record<string, string | string[]>;
}

export const slugFromPath = (path: string) => {
	return path.match(/([\w-]+)\.(md)/i)?.[1] ?? null;
};

export const load = async (): Promise<Post[]> => {
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
