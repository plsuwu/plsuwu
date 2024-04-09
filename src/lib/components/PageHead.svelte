<script lang="ts">
    import { page } from "$app/stores";

    function titleFromPath(path: string[]): string {
        if (path.length === 2) {
            return path[1] === "" ? "plsuwu" : path[1] + " @ plsuwu";
        } else {
            return path[2] + " @ plsuwu";
        }
    }

    let title: string;

    $: if ($page) {
        title = titleFromPath($page.url.pathname.split("/"));
    }
</script>

<svelte:head>
    <title>{title}</title>
    <meta property="og:title" content={title} />
</svelte:head>
