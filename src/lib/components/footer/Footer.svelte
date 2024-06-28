<script lang="ts">
	// this would block the pageload if run from the server, right??
	import { fetchIcon, links } from '$utils/fetchIcon';
	import SquareBraceButton from '$uic/squarebrace/SquareBraceButton.svelte';

	$: text = 'uwu';
	function uwu() {
		text = text === 'uwu' ? 'owo' : 'uwu';
	}
</script>

<div
	class="flex flex-row w-full justify-between py-2 px-4 space-x-4 bg-l-darkpink/20 shadow-inner"
>
	<div class="inline-flex mt-2">
		<button on:click={uwu}>
			{text}
		</button>
	</div>
	<div class="inline-flex space-x-2">
		<div class="mt-1 opacity-50">plsuwu:</div>
		{#each links as link}
			{#await fetchIcon(link.fetchIcon)}
				<div>
					{link.loading}
				</div>
			{:then Icon}
				<div class="inline-flex text-2xl font-light">
					<a href={link.href} target="_blank" class="group">
						<SquareBraceButton handleParentEvent={undefined}>
							<svelte:component
								this={Icon.default}
								class="text-xl inline"
							/>
						</SquareBraceButton>
					</a>
				</div>
			{/await}
		{/each}
	</div>
</div>
