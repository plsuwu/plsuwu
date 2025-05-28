export interface Component {
	title: string;
	href: string;
	description?: string;
}

export const components: Component[] = [
	{
		title: "writeups",
		href: "/posts/writeups",
	},
	{
		title: "miscellaneous",
		href: "/posts/misc",
	},
];
