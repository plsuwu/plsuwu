import { goto } from '$app/navigation';
import { page } from '$app/stores';

import type { Param } from './navigation';

// import { get, derived } from 'svelte/store';
// export const currentUrl = derived(
//     page,
//     ($page) => (suffix: string) => $page.url + ' ' + suffix
// );

export function updateParams(params: Param, path?: string, replace: boolean = false) {
    const unsubscribe = page.subscribe(($page) => {
        const url = new URL(path ? `${$page.url.origin}${path}` : $page.url.toString());

        Object.entries(params).forEach(([key, value]) => {
            if (!value) {
                url.searchParams.delete(key);
            } else {
                url.searchParams.set(key, value);
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
