<script lang="ts">
	// parent component should handle the click event as this component should be reasonably generic
	export let handleParentEvent: ((event: MouseEvent) => void) | undefined;
	export let classMod: string = '';
</script>

<button
	on:click={handleParentEvent}
	class={`group flex flex-row w-full items-center transition-all duration-300 ease-out hover:text-l-pink ${classMod}`}
>
	<slot />
</button>
