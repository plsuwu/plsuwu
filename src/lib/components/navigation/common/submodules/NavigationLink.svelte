<script lang="ts">
	import ButtonNavigation from './ButtonNavigation.svelte';

    // trigger an on:click event in the parent (e.g, toggling the dropdown state when navigating)
    export let handleParentEvent: ((event: MouseEvent) => void) | undefined;
	export let href: string;
</script>

<a {href} class="w-full">
	<li class="w-full">
		<ButtonNavigation
            handleParentEvent={handleParentEvent}
            classMod={'flex w-full'}
        >
			<slot />
		</ButtonNavigation>
	</li>
</a>
