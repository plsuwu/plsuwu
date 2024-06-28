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
