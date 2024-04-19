<script lang="ts">
	// import HeroiconsBarsArrowDown16Solid from '~icons/heroicons/bars-arrow-down-16-solid';
	import HeroiconsArrowLongRightSolid from '~icons/heroicons/arrow-long-right-solid';
	import { elapsedTime } from '$lib/utils/utils';
	import { blur } from 'svelte/transition';
	import { expoIn } from 'svelte/easing';

	export let slug: string;
	export let title: string;
	export let author: string;
	export let date: string;
	export let area: string;
	export let tags: string[];
	export let description: string;

	const id = title
		.toLowerCase()
		.replace(/[^a-zA-Z ]/g, '')
		.replace(/\s/g, '-');

	function colorTag(tag: string): string {
		const colorMap: { [key: string]: string } = {
			ctf: 'text-l-darkpink/75',
		};

		return colorMap[tag];
	}

	// should determine if ctf or other route
	const href = slug && `/posts/ctf/${slug}`;
	const daysAgo = elapsedTime(new Date(date).getTime());
	const formattedDate = new Date(date).toLocaleDateString('en-AU');
</script>

<div class="w-full items-center p-2 sm:p-4">
	<div class="grid grid-cols-3 justify-between">
		<div class="flex flex-col content-center self-center justify-self-start">
			<a {href} class="text-xs font-bold sm:text-sm lg:text-lg">
				[ {title} ]
			</a>

			<div class="italic opacity-55">
				<div class="text-left text-xs sm:text-sm">
					<span class="hidden sm:inline">posted{' '}</span>{daysAgo},
				</div>
				<div class="text-left text-xs sm:text-sm">on {formattedDate}</div>
			</div>
		</div>

		<div
			class="col-span-1 content-center self-center justify-self-center sm:ml-8 sm:justify-self-start"
		>
			<div class="flex flex-row items-center space-x-2">
				<div class={`sm:text-md text-xs font-bold italic ${colorTag(area)}`}>
					{area}
				</div>
				<div class="mt-0.5 text-xs font-normal italic opacity-55">
					({author})
				</div>
			</div>

			<div class="hidden text-center text-xs italic opacity-55 sm:inline">
				tags:{' '}
				[{' '}{#each tags as tag, i}
					{#if i + 1 !== tags.length}
						<span>{tag}</span>,
					{:else}
						<span>{tag}</span>
					{/if}
				{/each}{' '}]
			</div>
		</div>

		<div class="col-span-1 items-center self-center justify-self-end text-center">
			<a
				class="group flex flex-row items-center space-x-1 rounded-md px-0.5 text-center align-top opacity-50 transition-all duration-300 ease-out hover:opacity-100"
				href={`posts/${area}/${slug}`}
			>
				<div class="transition-all duration-200 ease-out">[</div>
				<div
					class="mt-0.5 flex flex-row items-center rounded-md text-xs opacity-50 transition-colors duration-200 ease-out group-hover:opacity-100"
				>
					<div>{' '}read{' '}</div>
					<HeroiconsArrowLongRightSolid class="inline-flex" />
				</div>
				<div class="transition-all duration-200 ease-out">]</div>
			</a>
		</div>
	</div>
</div>
