import type { SvelteComponent } from 'svelte';

interface NavItem {
    name: string;
    href: string;
}

interface ParentNavItem {
    name: string;
    children: NavItem[];
}

export type NavButton = NavItem | ParentNavItem;

export interface MdsvexFile {
    default: import('svelte').SvelteComponent;
    metadata: Record<string, string | string[]>;
}

export interface PostTag {
    name: String;
    color: String;
}

export type MdsvexResolver = () => Promise<MdsvexFile>;

export interface BlogPost {
    slug: string;
    title: string;
    author: string;
    area: string;
    tags: string[];
    description: string;
    date: string;
    published: boolean;
}

// this imports a module rather than a component but this works fine for the time being
export type IconPromise = () => Promise<{ default: typeof SvelteComponent }>;

export interface IconLink {
    name: string;
    loading: string;
    getIcon: () => Promise<typeof import('svelte').SvelteComponent>; // similar to above.
    href: string;
}
