import { goto } from '$app/navigation';
import { page } from '$app/stores';
import type { Param } from './navigation';
import type { Post } from './postLoader';

export const matchPostAttr = <T extends Record<string, any>>(
	key: keyof T,
	value: any,
	items: T[]
): T[] => {
	return items.filter((item) => {
        if (key == 'tag') {
            return item[key.toString() + 's'].includes(value);
        } else {
            return item[key] === value;
        }
    });
};

export const filterPosts = (posts: Post[], params: Record<string, string | null>): Post[] => {
    let filteredPosts = posts;
    let result = [];
    Object.entries(params).forEach(([key, val]) => {
        filteredPosts = (matchPostAttr(key as keyof Post, val, filteredPosts));
        result.push(...filteredPosts);
    });

	return filteredPosts;
};

export function updateParams(params: Record<string, any>, path?: string, replace: boolean = false) {
    const unsubscribe = page.subscribe(($page) => {
        const url = new URL(path ? `${$page.url.origin}${path}` : $page.url.toString());
        Object.entries(params).forEach(([key, val]) => {
            if (val === null) {
                url.searchParams.delete(key);
            } else {
                url.searchParams.set(key, val);
            }
        });

        if (replace) {
            history.replaceState(null, '', url.toString());
        } else {
            goto(url);
        }
    });

    unsubscribe();
}
