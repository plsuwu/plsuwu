<script lang="ts">
	import type { Post as TypedPost } from '$utils/postLoader';
	import { page } from '$app/stores';
	import PostMeta from './PostMeta.svelte';
	import CompToc from './common/tables-of-contents/CompTOC.svelte';

	export let posts: TypedPost[];
	const params = $page.url.searchParams.get('type');
	const ctfs = new Set(posts.map((post) => post.from));
</script>

{#if params && params.includes('ctf')}
	<CompToc {ctfs} />
{/if}

<div
	class="flex w-full flex-col justify-self-center text-center transition-all duration-300 ease-in-out"
>
	{#each posts as post, i}
		<div
			class="hidden min-w-[380px] max-w-[725px] flex-row self-center border-b border-l-pink/30 transition-all duration-300 ease-in-out sm:w-[70%] sm:px-0 md:flex 2xl:w-[45%]"
		></div>
		<div
			class={`flex max-h-[150px] min-h-[150px] w-full min-w-[380px] max-w-[725px] flex-row items-center justify-between space-x-4 space-y-2 self-center overflow-hidden rounded-md px-8 text-justify transition-all duration-300 ease-in-out sm:w-[70%] sm:px-0 2xl:w-[45%]`}
		>
			<PostMeta metadata={post} />
		</div>
		{#if i + 1 === posts.length}
			<div
				class="flex min-w-[380px] max-w-[725px] flex-row self-center border-b border-l-pink/30 transition-all duration-300 ease-in-out sm:w-[70%] sm:px-0 2xl:w-[45%]"
			></div>
		{/if}
	{/each}
</div>
