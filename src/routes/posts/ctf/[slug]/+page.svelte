<script lang="ts">
	// import { onMount } from 'svelte';

	import type { PageData } from './$types';
	import type { SvelteComponent } from 'svelte';

	export let data: PageData;

	type C = $$Generic<typeof SvelteComponent<string, string, string>>;
	$: component = data.component as unknown as C;

	// the builtin `scrollTo({top: 0, behavior: 'smooth'})` doesn't have the nice gradual slowdown
	// when nearing top, so we use this function to do a nice smooth scroll back up.
	const backToTop = () => {
		const pos = document.documentElement.scrollTop || document.body.scrollTop;
		if (pos > 0) {
			window.requestAnimationFrame(backToTop);
			window.scrollTo(0, pos - pos / 28);
		}
	};
</script>

<div class="mt-4 flex w-full flex-col items-center justify-center rounded-xl">
	<div
		class="prose w-full text-sm transition-all duration-500 ease-out lg:w-[85%] xl:w-[60%]"
	>
		<svelte:component this={component} />
		<slot />
	</div>
	<div class="mt-12">
		<div class="border border-pink-200 p-0.5 rounded-md">
			<button
				on:click={backToTop}
				class="rounded-md bg-l-whitepink/55 p-2 text-l-darkpink transition-colors duration-200 hover:text-l-pink/75"
				>^ back to top</button
			>
		</div>
	</div>
</div>
