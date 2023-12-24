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
        name: "docs",
        children: [
            { name: "writeups", href: "/writeups" },
            // { name: "notes", href: "/notes" }, // TODO: separate 'notes' page
        ],
    },
    { name: "about", href: "/about" },
];

