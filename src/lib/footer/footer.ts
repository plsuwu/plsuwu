export interface Footer {
    name: string;
    placeholder: string;
    getIcon: () => Promise<typeof import('svelte').SvelteComponent>;
    href: string;
}

export const footer: Footer[] = [
    {
        name: "github",
        placeholder: "gh",
        getIcon: () => import('virtual:icons/ph/github-logo-duotone'),
        href: "https://github.com/plsuwu"
    },
]
