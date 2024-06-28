type Element = Container | Page;


interface Page {
	name: string;
	href?: string;
    param?: Param;
}

interface Container {
	name: string;
	children: Page[];
}

type value = string;
export type Param = { type: value };
export const pages: Element[] = [
	{ name: 'home', href: '/' },
	{
		name: 'posts',
		children: [
			{ name: 'all posts', href: '/posts' },
			{ name: 'ctf', param: { 'type': 'ctf' } },
			{ name: 'notes', param: { 'type': 'note' } },
		],
	},
	{ name: 'about', href: '/about' },
];
