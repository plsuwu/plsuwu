<script lang="ts">
    import Article from "$lib/components/Post/Article.svelte";
    import ArticleTitle from "$lib/components/Post/ArticleTitle.svelte";
    import ArticleMeta from "$lib/components/Post/ArticleMeta.svelte";
    import ArticleDescription from "$lib/components/Post/ArticleDescription.svelte";
    import type { BlogPost } from "$lib/types";

    export let sortedPosts: BlogPost[];
</script>

{#each sortedPosts as { slug, title, author, tags, description, date }}
    <div class="lg:mx-2 my-0">
        <Article {slug}>
            <ArticleTitle {slug} {title} />
            <ArticleMeta {date} {author} {tags} />
            <ArticleDescription {description} />
        </Article>
    </div>
{/each}
