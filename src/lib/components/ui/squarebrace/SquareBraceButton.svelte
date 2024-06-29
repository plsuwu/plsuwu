<script lang="ts">
	export let handleParentEvent: ((event: MouseEvent) => void) | undefined;
	export let opacityMod: string = '';
</script>

<button
	on:click={handleParentEvent}
	class={`group flex flex-row justify-center space-x-2 group-hover:opacity-100`}
>
	<div
		class={`${opacityMod ? `${opacityMod} font-medium text-l-pink` : 'opacity-25'} group  transition-all duration-300 ease-in-out group-hover:opacity-100`}
	>
		[
	</div>
	<div class={`${opacityMod ? `${opacityMod} font-medium` : 'opacity-50'} group transition-all duration-300 ease-in-out group-hover:opacity-100`}>
		<slot />
	</div>
	<div
		class={`${opacityMod ? `${opacityMod} font-medium text-l-pink` : 'opacity-25'} group transition-all duration-300 ease-in-out group-hover:opacity-100`}
	>
		]
	</div>
</button>
