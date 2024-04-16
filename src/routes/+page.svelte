<script lang="ts">
	import HeroiconsArrowLongRightSolid from '~icons/heroicons/arrow-long-right-solid';
	import type { PageData } from './$types';
	import type { BlogPost } from '$lib/utils/types';
	import PostLayout from '$lib/components/posts/PostLayout.svelte';

	export let data: PageData;
	let recent: BlogPost[] = data.posts;

	if (data.posts) {
		recent = data.posts
			.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
			.slice(0, 5);
	}
</script>

<div class="flex w-full flex-col justify-center space-y-10 px-6">
	<div class="self-center text-5xl font-extrabold pb-4">plsuwu</div>
	<div class="flex w-1/3 flex-row justify-between self-center">
		<div class="text-lg font-semibold underline italic">recent:</div>
        <div class='border-l border-l-darkpink/55 my-1'></div>
		<a
			href="/posts"
			class="text-md flex flex-row items-center space-x-2 font-semibold italic text-l-darkpink/50 transition-colors duration-200 hover:text-l-darkpink"
		>
			<div>view all</div>
			<HeroiconsArrowLongRightSolid class="inline" />
		</a>
	</div>
	<PostLayout sortedPosts={recent} />
</div>
