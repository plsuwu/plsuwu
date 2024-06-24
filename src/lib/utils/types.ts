import type { SvelteComponent } from 'svelte';


export type MdsvexResolver = () => Promise<MdsvexFile>;
export type NavButton = NavItem | ParentNavItem;

// this is typing something that imports a module rather than a component
// (ie, wrong type - its fine for now though)
export type IconPromise = () => Promise<{ default: typeof SvelteComponent }>;

interface NavItem {
	name: string;
	href: string;
}

interface ParentNavItem {
	name: string;
	children: NavItem[];
}

export interface MdsvexFile {
	default: import('svelte').SvelteComponent;
	metadata: Record<string, string | string[]>;
}

export interface PostTag {
	name: String;
	color: String;
}

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

export interface IconLink {
	name: string;
	loading: string;
	getIcon: () => Promise<typeof import('svelte').SvelteComponent>; // similar situation to `IconPromise` above.
	href: string;
}
