<script lang="ts">
	import type { PageData } from './$types';

    /*
	* TODO:
	*      tagging,
	*      search stuff,
	*      + separate CTFs into respective challenges/sites/whatever
    */

    // import PageHead from '$lib/components/PageHead.svelte';
	import Article from '$lib/components/Article.svelte';
	import ArticleTitle from '$lib/components/ArticleTitle.svelte';
	import ArticleMeta from '$lib/components/ArticleMeta.svelte';
	import ArticleDescription from '$lib/components/ArticleDescription.svelte';
	export let data: PageData;



</script>


<!-- TODO: all pages should use mt-14 lg:mt-0!! -->
<div class="mt-14 w-full flex-col lg:mt-0">
	<div class="w-full self-center bg-cat-mantle pb-6">
		<div class="text-center font-bold text-cat-text">
			<div class="text-center  text-3xl font-bold text-cat-overlay0 lg:text-3xl py-8">writeups</div>
		</div>
		<div class="mx-auto w-full rounded-xl bg-cat-crust text-cat-text xl:min-w-[1300px] xl:max-w-[1300px]">
			<div
				class="mx-auto flex flex-col px-4 text-sm sm:text-xl lg:space-y-0 lg:p-8 2xl:grid 2xl:grid-cols-3 pt-2 pb-6 xl:min-w-[1300px] xl:max-w-[1300px]"
            >

				{#each data.posts as { slug, title, author, description, date }}
					<div class="lg:mx-2 my-0">
						<Article {slug}>
							<ArticleTitle {slug} {title} />
							<ArticleMeta {author} {date} />
							<ArticleDescription {description} />
						</Article>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>


