<script lang="ts">
    import SquareBraceText from '$components/ui/squarebrace/SquareBraceText.svelte';
    import PostsCtfEvents from './common/tables-of-contents/PostsCtfEvents.svelte';
    import PostCategoryFilters from './common/tables-of-contents/PostCategoryFilters.svelte';
    import PostMetadataCard from './PostMetadataCard.svelte';
	import type { Post as TypedPost } from '$utils/post';
	import { page } from '$app/stores';
    import { blur } from 'svelte/transition';

	export let posts: TypedPost[];
	export let tags;
	export let ctfs;

	const postTypeParam = $page.url.searchParams.get('type');
	const searchQueryParam = $page.url.searchParams.get('s');
	const ctfTagsParam = $page.url.searchParams.get('tag');
	const ctfFromParam = $page.url.searchParams.get('from');

	const hasAppliedFilter = [ctfTagsParam, ctfFromParam].some((item) => item !== null);
</script>

{#if postTypeParam && postTypeParam.includes('ctf')}
	<PostsCtfEvents {ctfs} {tags} />
{/if}

<div
    in:blur={{ delay: 50, duration: 200 }}
	class="flex w-full flex-col justify-self-center text-center transition-all duration-300 ease-in-out"
>
	{#if posts.length >= 1}
		{#each posts as post, i}
			<div
				class="min-w-[380px] max-w-[725px] flex-row self-center border-b border-l-pink/30 transition-all duration-300 ease-in-out sm:w-[70%] sm:px-0 md:flex 2xl:w-[45%]"
			></div>
			<div
				class={`flex w-full min-w-[380px] max-w-[725px] flex-row items-center justify-between space-x-4 space-y-2 self-center overflow-hidden rounded-md px-8 text-justify transition-all duration-300 ease-in-out sm:w-[70%] sm:px-0 2xl:w-[45%]`}
			>
				<PostMetadataCard metadata={post} />
			</div>
			{#if i + 1 === posts.length}
				<div
					class="flex min-w-[380px] max-w-[725px] flex-row self-center border-b border-l-pink/30 transition-all duration-300 ease-in-out sm:w-[70%] sm:px-0 2xl:w-[45%]"
				></div>
			{/if}
		{/each}

    <!-- quite likely that there is a better way to do this but we just if/else if/else and so on for now -->
	{:else if searchQueryParam != null && posts.length < 1}
    <!-- no matching content for given search term -->
		<SquareBraceText classMod={'text-lg'}>
			<div class="inline-flex text-sm opacity-75">
				no metadata matching query {'"'}<span
					class="font-semibold italic text-l-lightpink opacity-100 brightness-75"
					>{searchQueryParam}</span
				>{'"'} {':<'}
			</div>
		</SquareBraceText>
		{#if hasAppliedFilter}
            <!--
            suggest removing filters if the user is searching and filtering with no
            returned results
            -->
			<div class="mt-4 flex w-max flex-row self-center text-xs italic opacity-50">
				{'(maybe disable any enabled filters?)'}
			</div>
		{/if}
	{:else if posts.length < 1 && searchQueryParam == null}
    <!--
    either:
        1) the user selected a category with no content (e.g notes),
        2) they have selected a combination of filters with no applicable content
    -->
		<SquareBraceText classMod={'text-lg'}>
			<div class="inline-flex text-sm opacity-50">
				{#if !hasAppliedFilter}
					there's nothing here right now {':<'}
				{:else}
				    no content matches this filter combination {':<'}
				{/if}
			</div>
		</SquareBraceText>
	{/if}
</div>

{#if $page.url.pathname.includes('posts')}
	<PostCategoryFilters />
{/if}
