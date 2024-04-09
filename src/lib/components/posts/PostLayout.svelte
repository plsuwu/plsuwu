<script lang='ts'>
    import Article from "./Article.svelte";
    import type { BlogPost } from '$lib/utils/types';

    export let sortedPosts: BlogPost[];

</script>

{#each sortedPosts as { slug, title, author, tags, description, date }}
aretcle:
    <Article {slug} {title} {date} {author} {tags} {description} />
{/each}
