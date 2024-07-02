<script lang="ts">
	// this would block the pageload if run from the server, right?? ...right?
	import { fetchIcon, links } from '$utils/fetchIcon';
	import SquareBraceButton from '$uic/squarebrace/SquareBraceButton.svelte';

	$: text = 'uwu';
	function uwu() {
		text = text === 'uwu' ? 'owo' : 'uwu';
	}
</script>

<div
	class="flex w-full flex-row justify-between space-x-4 bg-l-darkpink/20 px-4 py-2 shadow-inner text-xs"
>
	<div class="mt-1 inline-flex">
		<button on:click={uwu}>
			{text}
		</button>
	</div>
	<div class="inline-flex space-x-2">
		<div class="opacity-50 mt-1.5">plsuwu:</div>
		{#each links as link}
			{#await fetchIcon(link.fetchIcon)}
				<div>
					{link.loading}
				</div>
			{:then Icon}
				<div class="inline-flex text-sm font-light mt-0.5">
					<a href={link.href} target="_blank" class="group">
						<SquareBraceButton handleParentEvent={undefined}>
							<svelte:component
								this={Icon.default}
								class="inline text-sm"
							/>
						</SquareBraceButton>
					</a>
				</div>
			{/await}
		{/each}
	</div>
</div>
