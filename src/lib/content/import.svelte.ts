const DEFAULT_COVER_PATH = "/posts/default.png";

// clean this up

export default class Posts {
	MODULES = import.meta.glob("/src/posts/**/*.md");
	loaded = $state(false);

	posts: Post[] = $state([]);
	constructor() {
		// const entries = Object.entries(this.MODULES);
		const promise = async () => {
			return Promise.all(
				Object.entries(this.MODULES).map(async ([path, reslv]) =>
					reslv().then((post) => {
						const meta = {
							slug: resolveSlug(path),
							...(post as unknown as MdsvexFile).metadata,
						} as Post;

						if (!meta.cover) {
							meta.cover = DEFAULT_COVER_PATH;
						}

						return meta;
					})
				)
			);
		};

		promise().then((posts) => {
			this.posts = posts;
			this.loaded = true;
		});
	}
}

export const resolveSlug = (path: string) => {
	return path.match(/([\w-]+)\.(md)/i)?.[1] ?? null;
};

export interface Post {
	id: string;
	title: string;
	excerpt: string;
	date: Date;
	author: string;
	cover: string;
	tags: string[];
	slug: string;
	component?: any;
}

export interface PostCategory {}

export interface MdsvexFile {
	default: import("svelte").SvelteComponent;
	metadata: Record<string, string | string[]>;
}

export type MdsvexResolver = () => Promise<MdsvexFile>;
