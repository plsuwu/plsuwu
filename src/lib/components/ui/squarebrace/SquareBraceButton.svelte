<script lang="ts">
	export let handleParentEvent: ((event: MouseEvent) => void) | undefined;
	export let classMod: string = '';
</script>

<button
	on:click={handleParentEvent}
	class={`group flex flex-row justify-center space-x-2 group-hover:opacity-100 ${classMod}`}
>
	<div
		class="group opacity-25 transition-all duration-300 ease-in-out group-hover:opacity-100"
	>
		[
	</div>
	<div
		class="group opacity-50 transition-all duration-300 ease-in-out group-hover:opacity-100"
	>
		<slot />
	</div>
	<div
		class="group opacity-25 transition-all duration-300 ease-in-out group-hover:opacity-100"
	>
		]
	</div>
</button>
