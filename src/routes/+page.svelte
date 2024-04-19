<script lang="ts">
	import HeroiconsArrowLongRightSolid from '~icons/heroicons/arrow-long-right-solid';
	import HeroiconsSparkles from '~icons/heroicons/sparkles';
    import HeroiconsBookOpen from '~icons/heroicons/book-open';
	import { blur } from 'svelte/transition';
	import { expoIn, expoOut, sineIn } from 'svelte/easing';
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
	<div class="self-center pb-4 text-5xl font-extrabold">plsuwu</div>
	<div class="flex w-full md:w-1/2 lg:w-1/3 flex-row justify-between self-center">
		<div class="group inline-flex items-center space-x-1 rounded-md px-0.5">
			<div class="">[</div>
			<div class="rounded-md px-1 text-lg font-semibold">
				<HeroiconsSparkles class="inline-flex" />
				<div class="inline-flex">recent</div>
			</div>
			<div class="">]</div>
		</div>
		<div class="my-1 border-l border-l-darkpink/55"></div>

		<a
			href="/posts"
			class="text-md flex flex-row items-center text-l-darkpink/40 transition-all duration-200"
		>
			<div
				class="group inline-flex items-center space-x-1 rounded-md px-0.5 transition-all duration-200 ease-out"
			>
				<div
					class="transition-all duration-200 ease-out group-hover:text-l-darkpink"
				>
					[
				</div>
				<div
					class="rounded-md px-1 font-semibold opacity-50 transition-all duration-200 ease-out group-hover:text-l-darkpink group-hover:opacity-100"
				>
					<div class="inline-flex">view all</div>
					<HeroiconsBookOpen class="inline-flex -mt-0.5" />
				</div>
				<div
					class="transition-colors duration-200 ease-out group-hover:text-l-darkpink"
				>
					]
				</div>
			</div>
		</a>
	</div>

	{#key recent[0].title}
		<ul
			class="flex w-full flex-col space-y-4 self-center rounded-md sm:max-w-4xl xl:w-[65%]"
			in:blur={{ delay: 0, duration: 500, easing: sineIn }}
		>
			<PostLayout sortedPosts={recent} />
		</ul>
	{/key}
</div>
