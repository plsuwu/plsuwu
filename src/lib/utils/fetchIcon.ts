export type IconModule = typeof import('~icons/*');
export type IconModulePromise = () => Promise<IconModule>;

export interface IconLink {
    name: string;
    loading: string;
    fetchIcon: IconModulePromise;
    href: string;
}

export async function fetchIcon(icon: IconModulePromise): Promise<IconModule> {
    const iconModule = await icon();
    return iconModule;
}


export const links: IconLink[] = [
    {
        name: 'github',
        loading: 'gh',
        fetchIcon: () => import('~icons/mdi/github'),
        href: 'https://github.com/plsuwu',
    },
    {
        name: 'soundcloud',
        loading: 'sc',
        fetchIcon: () => import('~icons/mdi/soundcloud'),
        href: 'https://soundcloud.com/plsuwu',
    }
];
