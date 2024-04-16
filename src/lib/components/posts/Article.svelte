<script lang="ts">
	import HeroiconsBarsArrowDown16Solid from '~icons/heroicons/bars-arrow-down-16-solid';
	import HeroiconsArrowLongRightSolid from '~icons/heroicons/arrow-long-right-solid';
	import { truncate, elapsedTime } from '$lib/utils/utils';

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

<div class="w-full items-center p-4">
	<div class="grid grid-cols-3 justify-between">
		<div class="flex flex-col content-center self-center justify-self-start">
			<a {href} class="text-sm font-bold lg:text-lg">
				[ {title} ]
			</a>

			<div class="italic opacity-55">
				<div class="text-left text-sm">posted {daysAgo},</div>
				<div class="text-left text-sm">on {formattedDate}</div>
			</div>
		</div>

		<div class="col-span-1 content-center self-center justify-self-start">
			<div class="flex flex-row items-center space-x-2">
				<div class={`text-md font-bold italic ${colorTag(area)}`}>{area}</div>
				<div class="mt-0.5 text-xs font-normal italic opacity-55">
					({author})
				</div>
			</div>

			<div class="text-xs italic opacity-55">
				tagged:{' '}
				[{' '}{#each tags as tag, i}
					{#if i + 1 !== tags.length}
						<span>{tag}</span>,
					{:else}
						<span>{tag}</span>
					{/if}
				{/each}{' '}]
			</div>
		</div>

		<div class="col-span-1 self-center justify-self-end">
			<a
				href={`posts/${area}/${slug}`}
				class="group flex flex-row items-center text-lg transition-all duration-200 group-hover:text-l-darkpink/55"
			>
				[
				<div
					class="group mt-1 flex flex-row space-x-2 text-xs transition-all duration-200 group-hover:text-l-darkpink/55"
				>
					<div>{' '}read{' '}</div>
					<HeroiconsArrowLongRightSolid />
				</div>
				]
			</a>
		</div>
	</div>
</div>
