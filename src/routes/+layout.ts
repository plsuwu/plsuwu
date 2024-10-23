import type { PageLoad } from './posts/$types';

export const load: PageLoad = ({ url }) => {
    const { pathname } = url;

    return {
        pathname
    };
};
