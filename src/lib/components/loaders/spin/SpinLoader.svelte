<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	let display = $state(false);

	onMount(() => {
		setTimeout(() => {
			display = true;
		}, 100);
	});
</script>

{#if display}
	<span class="absolute top-100"> placeholder loading :3</span>
{/if}
