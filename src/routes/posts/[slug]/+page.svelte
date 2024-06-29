<script lang="ts">
	import type { PageData } from './$types';
	import type { SvelteComponent } from 'svelte';

	export let data: PageData;
	type C = $$Generic<typeof SvelteComponent<string, string, string>>;
	$: component = data.component as unknown as C;
</script>

<div class="w-full xl:w-[65%] 3xl:w-[45%] px-4 transition-all">
	<div class="prose">
		<svelte:component this={component} />
		<slot />
	</div>
</div>
