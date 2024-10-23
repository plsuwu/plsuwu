import { base } from '$app/paths';
import { updateParams, type Param } from './param';

export type IconModule = typeof import('~icons/*');
export type IconModulePromise = () => Promise<IconModule>;
export type Element = Container | Page;

export interface Page {
    name: string;
    href?: string;
    param?: Param;
    icon?: IconLink;
}

export interface Container {
    name: string;
    children: Page[];
}

export interface IconLink {
    name: string;
    loading: string;
    fetchIcon: IconModulePromise;
    href?: string;
}

export const setRoute = (active: string, name: string, param?: Param, path?: string) => {
    if (param) {
        updateParams({ type: param.type }, path);
    }

    active = active === name ? '' : name;
    return active;
};

export async function fetchIcon(icon: IconModulePromise): Promise<IconModule> {
    const iconModule = await icon();
    return iconModule;
}

const externLinkIcon: IconLink = {
    name: 'external-link',
    loading: '',
    fetchIcon: () => import('~icons/mdi/external-link'),
};

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
    { name: 'tiles', href: 'https://tiles.plsuwu.com', icon: externLinkIcon },
];

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
    },
];
