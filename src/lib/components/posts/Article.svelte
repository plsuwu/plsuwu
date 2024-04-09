<script lang="ts">
	import { truncate, elapsedTime } from '$lib/utils/utils';
	export let slug: string;
	export let title: string;
	export let author: string;
	export let date: string;
	export let tags: string[];
	export let description: string;

	const id = title
		.toLowerCase()
		.replace(/[^a-zA-Z ]/g, '')
		.replace(/\s/g, '-');

	// should determine if ctf or other route
	const href = slug && `/posts/ctf/${slug}`;
	const daysAgo = elapsedTime(new Date(date).getTime());
	const formattedDate = new Date(date).toDateString();
</script>

<div>
	<article>
		<div
			class="m-3 mb-0 max-w-fit text-left text-xl font-bold italic transition-colors duration-300 ease-in-out lg:text-2xl"
			{id}
		>
			<a {href}>
				{title}
			</a>
		</div>
		<div class="p-px">
			<p class="p-2 pb-0 pl-1 sm:p-4">
				<span class="my-1 text-start italic">
					<div class="mb-1">description:</div>
					<span class="text-lg">&ldquo;</span>{truncate(description, 64)}<span
						class="text-lg">&rdquo;</span
					></span
				>
			</p>
		</div>
		<div class="mb-2 space-x-2 italic">
			<span class="ml-2">posted {daysAgo} ({formattedDate}) </span>
			<span class=" "> </span>
			<div class="relative -z-10 opacity-25">{author}</div>
			<div class="">
				{tags.length} tags:
				<span class="text-left">
					[ {#each tags as tag, i}
						{#if i + 1 !== tags.length}
							<span>{tag}</span>,
						{:else}
							<span>{tag}</span>
						{/if}
					{/each}]
				</span>
			</div>
		</div>
	</article>
</div>
<!-- <div class="border border-b"></div> -->
