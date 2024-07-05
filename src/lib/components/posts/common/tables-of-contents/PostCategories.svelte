<script lang="ts">
	import SquareBraceButton from '$components/ui/squarebrace/SquareBraceButton.svelte';
	import { pages } from '$utils/navigation';
	import { updateParams } from '$utils/param';
	import { thisIterInParams } from '$utils/thisIterInParams';
	import type { Container, Param } from '$utils/navigation';
	import { page } from '$app/stores';
	import Search from '$components/ui/Search.svelte';

	const urlParams = $page.url.searchParams;
	const postLocations = (pages.find((page) => page.name === 'posts') as Container).children;

	const setRoute = (param?: Param, path?: string) => {
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
	class="-ml-38 fixed mt-14 hidden w-1/5 flex-col items-start self-end text-left xl:flex 3xl:w-1/4"
>
<div class="mb-8 flex flex-col items-start self-start text-left">
<Search />
</div>
	<div class="mb-2 text-lg font-bold">categories</div>
	<div class="flex flex-col items-start self-start text-left">

		{#each postLocations as { name, href, param }}
			{#if param}
				<SquareBraceButton
					handleParentEvent={() => setRoute({ type: param.type }, href)}
					opacityMod={`${thisIterInParams({ type: param.type }, urlParams) ? 'opacity-100' : ''}`}
				>
					{#if thisIterInParams({ type: param.type }, urlParams)}
						<div class="opacity-100">{name}</div>
					{:else}
						<div>{name}</div>
					{/if}
				</SquareBraceButton>
			{/if}
		{/each}

	</div>
</div>
