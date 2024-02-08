export interface MdsvexFile {
    default: import('svelte').SvelteComponent;
    metadata: Record<string, string|string[]>;
}

export interface MkBanner {
    default: import('svelte').SvelteComponent;
}

export type MdsvexResolver = () => Promise<MdsvexFile>;

export interface BlogPost {
    slug: string;
    title: string;
    author: string;
    tags: string[];
    description: string;
    date: string;
    published: boolean;
}
