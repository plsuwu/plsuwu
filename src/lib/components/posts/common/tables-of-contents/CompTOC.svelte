<script lang="ts">
	import SquareBraceButton from '$components/ui/squarebrace/SquareBraceButton.svelte';
	import { updateParams } from '$utils/param';
	import type { Param } from '$utils/navigation';

	export let ctfs;
	export let tags;

	const setRoute = (param?: Param, path?: string) => {
		// handle setting URL params if a link that sets a URL
		// param was clicked
		if (param) {
			Object.entries(param).forEach(([key, val]) => {
				updateParams({ type: 'ctf', [key]: val }, path ?? undefined);
			});
		}
	};
</script>

<div
	class="-ml-38 fixed mt-28 hidden w-1/5 flex-col items-end text-right xl:flex 3xl:w-1/4"
>
	<div class="mb-2 text-lg font-bold">ctf events {'&'} sites</div>
	<div class="flex flex-col items-end self-end text-right">
		{#each ctfs as from}
			<SquareBraceButton handleParentEvent={() => setRoute({ type: 'ctf', from })}>
				<div>{from}</div>
			</SquareBraceButton>
		{/each}
	</div>

	<div class="mb-2 mt-8 text-lg font-bold">tags</div>
	<div class="flex flex-col items-end self-end text-right">
		{#each tags as tag}
			<SquareBraceButton handleParentEvent={() => setRoute({ type: 'ctf', tag })}>
				<div>{tag}</div>
			</SquareBraceButton>
		{/each}
	</div>
</div>
