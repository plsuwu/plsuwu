import type { NavButton } from '$lib/utils/types';

export const pages: NavButton[] = [
	{ name: 'home', href: '/' },
	{
		name: 'posts',
		children: [
			{ name: 'all posts', href: '/posts' },
			// { name: 'ctf stuff', href: '/posts/ctf' }, // leaving these here for future ref
			// { name: 'notes', href: '/posts/notes' }
		],
	},
	{
		name: 'about',
		href: '/about',
	},
];
