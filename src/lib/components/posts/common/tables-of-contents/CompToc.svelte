<script lang="ts">
	import SquareBraceButton from '$components/ui/squarebrace/SquareBraceButton.svelte';
	import { updateParams } from '$utils/param';
	import { thisIterInParams } from '$utils/thisIterInParams';
	import type { Param } from '$utils/navigation';
	import { page } from '$app/stores';

	export let ctfs;
	export let tags;
	const urlParams = $page.url.searchParams;

	const setRoute = (param?: Param, path?: string) => {
		// handle setting URL params if a link that sets a URL
		// param was clicked
		if (param) {
			Object.entries(param).forEach(([key, val]) => {
				if (!thisIterInParams({ [key]: val }, urlParams)) {
					updateParams({ type: 'ctf', [key]: val }, path ?? undefined);
				} else {
					updateParams({ [key]: null }, path ?? undefined);
				}
			});
		}
	};
</script>

<div
	class="-ml-38 fixed mt-14 hidden w-1/5 flex-col items-end text-right xl:flex 3xl:w-1/4"
>
	<div class="mb-2 text-lg font-bold">ctf events {'&'} sites</div>
	<div class="flex flex-col items-end self-end text-right">
		{#each ctfs as from}
			<SquareBraceButton
				handleParentEvent={() => setRoute({ type: 'ctf', from })}
				opacityMod={`${thisIterInParams({ from }, urlParams) ? 'opacity-100' : ''}`}
			>
				{#if thisIterInParams({ from }, urlParams)}
					<div class="opacity-100">{from}</div>
				{:else}
					<div>{from}</div>
				{/if}
			</SquareBraceButton>
		{/each}
	</div>

	<div class="mb-2 mt-8 text-lg font-bold">tags</div>
	<div class="flex flex-col items-end self-end text-right">
		{#each tags as tag}
			<SquareBraceButton
				handleParentEvent={() => setRoute({ type: 'ctf', tag })}
				opacityMod={`${thisIterInParams({ tag }, urlParams) ? 'opacity-100' : ''}`}
			>
				{#if thisIterInParams({ tag }, urlParams)}
					<div class="opacity-100">{tag}</div>
				{:else}
					<div>{tag}</div>
				{/if}
			</SquareBraceButton>
		{/each}
	</div>
</div>
