<script lang="ts">
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

<div
	class="mt-4 flex w-full flex-col items-center justify-center rounded-xl px-4 lg:px-0"
>
	<div class="flex w-full flex-row transition-all duration-500 lg:w-[85%] xl:w-[60%]">
    <!-- this is messy due to buttons which will be tidier as a component -->
		<button
			class="group inline-flex rounded-md px-0.5 transition-colors duration-200 ease-out hover:bg-l-darkblue"
			on:click={() => history.go(-1)}
		>
			<div
				class="transition-colors duration-200 ease-out group-hover:text-l-whitepink"
			>
				[
			</div>
			<div
				class="mt-1 self-center rounded-md px-1 text-xs opacity-50 transition-colors duration-200 ease-out group-hover:text-l-whitepink group-hover:opacity-100"
			>
				back
			</div>
			<div
				class="transition-colors duration-200 ease-out group-hover:text-l-whitepink"
			>
				]
			</div>
		</button>
	</div>

	<div class="mt-10 w-full border-b border-b-l-pink lg:w-[90%] xl:w-[65%]"></div>
	<div
		class="prose w-full flex flex-col text-sm transition-all duration-500 ease-out lg:w-[85%] xl:w-[60%]"
	>
		<svelte:component this={component} />
		<slot />
	</div>
	<div class="mt-10 w-full border-b border-b-l-pink lg:w-[90%] xl:w-[65%]"></div>

	<div
		class="mt-10 flex w-full flex-row justify-between transition-all duration-500 lg:w-[85%] xl:w-[60%]"
	>
		<button
			class="group inline-flex rounded-md px-0.5 transition-colors duration-200 ease-out hover:bg-l-darkblue"
			on:click={() => history.go(-1)}
		>
			<div
				class="transition-colors duration-200 ease-out group-hover:text-l-whitepink"
			>
				[
			</div>
			<div
				class="mt-1 self-center rounded-md px-1 text-xs opacity-50 transition-colors duration-200 ease-out group-hover:text-l-whitepink group-hover:opacity-100"
			>
				back
			</div>
			<div
				class="transition-colors duration-200 ease-out group-hover:text-l-whitepink"
			>
				]
			</div>
		</button>
		<button
			class="group inline-flex rounded-md px-0.5 transition-colors duration-200 ease-out hover:bg-l-darkblue"
			on:click={backToTop}
		>
			<div
				class="transition-colors duration-200 ease-out group-hover:text-l-whitepink"
			>
				[
			</div>
			<div
				class="mt-0.5 inline self-center rounded-md px-1 text-xs opacity-50 transition-colors duration-200 ease-out group-hover:text-l-whitepink group-hover:opacity-100"
			>
				return to top
			</div>
			<div
				class="transition-colors duration-200 ease-out group-hover:text-l-whitepink"
			>
				]
			</div>
		</button>
	</div>
</div>
