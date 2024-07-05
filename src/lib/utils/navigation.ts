import { updateParams } from './param';

export type Element = Container | Page;

export interface Page {
	name: string;
	href?: string;
	param?: Param;
}

export interface Container {
	name: string;
	children: Page[];
}

export type Param = Record<string, string | null>;

export const pages: Element[] = [
	{ name: 'home', href: '/' },
	{
		name: 'posts',
		children: [
			{ name: 'all posts', href: '/posts' },
			{ name: 'ctf', href: '/posts', param: { type: 'ctf' } },
			{ name: 'notes', href: '/posts', param: { type: 'note' } },
		],
	},
	{ name: 'about', href: '/about' },
];

export const setRoute = (active: string, name: string, param?: Param, path?: string) => {
	if (param) {
		updateParams({ type: param.type }, path);
	}

	active = active === name ? '' : name;
	return active;
};