<script lang='ts'>
    import { page } from '$app/stores';

    function titleFromPath(path: string[]): string {
        return path[1] === '' ? 'plsuwu' : path[path.length - 1] + ' // pls';
    };

    let title: string;
    $: if ($page) {
        title = titleFromPath($page.url.pathname.split('/'));
    };
</script>

<svelte:head>
    <title>{title}</title>
    <meta property="og:title" content={title} />
</svelte:head>
