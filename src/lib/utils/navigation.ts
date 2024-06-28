type Element = Container | Page;

interface Page {
    name: string,
    href: string,
}

interface Container {
    name: string,
    children: Page[],
}

export const pages: Element[] = [
    { name: "home", href: "/" },
    {
        name: "posts", children: [
            { name: "all posts", href: "/posts" },
            { name: "ctf", href: "/posts?type=ctf" },
            { name: "notes", href: "/posts?type=note" },
        ]
    },
    { name: "about", href: "/about" },
];
