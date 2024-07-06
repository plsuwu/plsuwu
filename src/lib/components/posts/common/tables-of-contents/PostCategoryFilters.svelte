<script lang="ts">
    import type { Container } from '$utils/navigation';
    import type { Param } from '$utils/param';
	import SquareBraceButton from '$components/ui/squarebrace/SquareBraceButton.svelte';
    import Search from '$components/ui/Search.svelte';
    import { page } from '$app/stores';
	import { pages } from '$utils/navigation';
	import { updateParams, paramsContain } from '$utils/param';

	const urlParams = $page.url.searchParams;
	const postLocations = (pages.find((page) => page.name === 'posts') as Container).children;

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
<div class="mb-8 flex flex-col items-start self-start text-left">
<Search />
</div>
	<div class="mb-2 text-lg font-bold">categories</div>
	<div class="flex flex-col items-start self-start text-left">

		{#each postLocations as { name, href, param }}
			{#if param}
				<SquareBraceButton
					handleParentEvent={() => setRoute({ type: param.type }, href)}
					opacityMod={`${paramsContain({ type: param.type }, urlParams) ? 'opacity-100 brightness-75' : ''}`}
				>
					{#if paramsContain({ type: param.type }, urlParams)}
						<div class="opacity-100 brightness-75">{name}</div>
					{:else}
						<div>{name}</div>
					{/if}
				</SquareBraceButton>
			{/if}
		{/each}

	</div>
</div>
