<script lang="ts">
	import type { Post as TypedPost } from '$utils/postLoader';
	import { page } from '$app/stores';

	import CompToc from './common/tables-of-contents/CompToc.svelte';
	import PostCategories from './common/tables-of-contents/PostCategories.svelte';
	import PostMeta from './PostMeta.svelte';
	import SquareBraceText from '$components/ui/squarebrace/SquareBraceText.svelte';

	export let posts: TypedPost[];
	export let tags;
	export let ctfs;

	const params = $page.url.searchParams.get('type');
	const searched = $page.url.searchParams.get('s');
</script>

{#if params && params.includes('ctf')}
	<CompToc {ctfs} {tags} />
{/if}
<div
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
				<PostMeta metadata={post} />
			</div>
			{#if i + 1 === posts.length}
				<div
					class="flex min-w-[380px] max-w-[725px] flex-row self-center border-b border-l-pink/30 transition-all duration-300 ease-in-out sm:w-[70%] sm:px-0 2xl:w-[45%]"
				></div>
			{/if}
		{/each}
	{:else if searched != null && posts.length < 1}
		<SquareBraceText classMod={'text-lg'}>
			<div class="inline-flex text-sm opacity-75">
				{"\""}<span
					class="italic font-semibold text-l-lightpink opacity-100 brightness-75"
					>{searched}</span
				>{"\""} doesn't match any documents {":<"}
			</div>
		</SquareBraceText>
        {:else if posts.length < 1 && searched == null}
		<SquareBraceText classMod={'text-lg'}>
			<div class="inline-flex text-sm opacity-50">
				there's nothing here right now {":<"}
			</div>
		</SquareBraceText>

	{/if}
</div>

{#if $page.url.pathname.includes('posts')}
	<PostCategories />
{/if}
