<script lang="ts">
	import SquareBraceButton from '$components/ui/squarebrace/SquareBraceButton.svelte';
	import type { Param } from '$utils/param';
	import { page } from '$app/stores';
	import { updateParams, paramsContain } from '$utils/param';

	export let ctfs;
	export let tags;
	const urlParams = $page.url.searchParams; // what is this doing lol

	const setRoute = (param?: Param, path?: string) => {
		if (param) {
			Object.entries(param).forEach(([key, val]) => {
				if (!paramsContain({ [key]: val }, urlParams)) {
					updateParams({ type: 'ctf', [key]: val }, path ?? undefined);
				} else {
					updateParams({ [key]: null }, path ?? undefined);
				}
			});
		}
	};
</script>

<div
	class="-ml-38 fixed mt-14 hidden w-1/5 flex-col items-start self-end text-left xl:flex 3xl:w-1/4"
>
	<div class="mb-2 text-lg font-bold">ctf events {'&'} sites</div>
	<div class="flex flex-col items-start self-start text-left">
		{#each ctfs as from}
			<SquareBraceButton
				handleParentEvent={() => setRoute({ type: 'ctf', from })}
				opacityMod={`${paramsContain({ from }, urlParams) ? 'opacity-100 brightness-75' : ''}`}
			>
				{#if paramsContain({ from }, urlParams)}
					<div class="opacity-100">{from}</div>
				{:else}
					<div>{from}</div>
				{/if}
			</SquareBraceButton>
		{/each}
	</div>

	<div class="mb-2 mt-8 text-lg font-bold">tags</div>
	<div class="flex flex-col items-start self-start text-left">
		{#each tags as tag}
			<SquareBraceButton
				handleParentEvent={() => setRoute({ type: 'ctf', tag })}
				opacityMod={`${paramsContain({ tag }, urlParams) ? 'opacity-100 brightness-75' : ''}`}
			>
				{#if paramsContain({ tag }, urlParams)}
					<div class="opacity-100">{tag}</div>
				{:else}
					<div>{tag}</div>
				{/if}
			</SquareBraceButton>
		{/each}
	</div>
</div>
