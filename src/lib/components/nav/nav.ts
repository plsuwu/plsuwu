import type { NavButton } from '$lib/utils/types';

export const pages: NavButton[] = [
	{ name: 'home', href: '/' },
	{
		name: 'posts',
		children: [{ name: 'ctf stuff', href: '/posts/ctf' }],
	},
    {
        name: 'about',
        href: '/about',
    },
];
