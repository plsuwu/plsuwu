interface Page {
    name: string;
    href: string;
}

interface ParentPage {
    name: string;
    children: Page[];
}

type PageLink = Page | ParentPage;

export const pages: PageLink[] = [
    { name: "home", href: "/" },
    {
        name: "posts",
        children: [
            { name: "ctf_writeups", href: "/posts" },
            // { name: "notes", href: "/notes" }, // TODO: separate 'notes' page
        ],
    },
    { name: "about", href: "/about" },
];

