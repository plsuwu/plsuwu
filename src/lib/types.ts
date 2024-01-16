export interface MdsvexFile {
    default: import('svelte').SvelteComponent;
    metadata: Record<string, string|string[]>;
}

export type MdsvexResolver = () => Promise<MdsvexFile>;

export interface BlogPost {
    slug: string;
    title: string;
    author: string;
    tags: any;
    description: string;
    date: string;
    published: boolean;
}
