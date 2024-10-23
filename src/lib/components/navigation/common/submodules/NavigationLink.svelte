<script lang="ts">
	import ButtonNavigation from './ButtonNavigation.svelte';

	interface attrs {
		target: string;
		// other attrs as needed
	}

	export let attrs: attrs | undefined;

	// trigger an on:click event in the parent (e.g, toggling the dropdown state when navigating)
	export let handleParentEvent: ((event: MouseEvent) => void) | undefined;
	export let href: string;
</script>

{#if attrs}
	<a {href} target={attrs.target} class="w-full">
		<li class="w-full">
			<ButtonNavigation {handleParentEvent} classMod={'flex w-full'}>
				<slot />
			</ButtonNavigation>
		</li>
	</a>
{:else}
	<a {href} class="w-full">
		<li class="w-full">
			<ButtonNavigation {handleParentEvent} classMod={'flex w-full'}>
				<slot />
			</ButtonNavigation>
		</li>
	</a>
{/if}
