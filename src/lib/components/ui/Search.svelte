<script lang="ts">
	import HeroiconsXCircle20Solid from '~icons/heroicons/x-circle-20-solid';
	import HeroiconsMagnifyingGlassCircle16Solid from '~icons/heroicons/magnifying-glass-circle-16-solid';
	import type { Param } from '$utils/param';
	import { page } from '$app/stores';
	import { updateParams, paramsContain } from '$utils/param';
	import { debounce } from '$utils/search';
	import { onMount } from 'svelte';

	const urlParams = $page.url.searchParams;
	const setRoute = (param?: Param, path?: string) => {
		if (param) {
			Object.entries(param).forEach(([key, val]) => {
				if (!paramsContain({ [key]: val }, urlParams)) {
					updateParams({ [key]: val }, path ?? undefined);
				} else {
					updateParams({ [key]: null }, path ?? undefined);
				}
			});
		}
	};

	let query: string | null = null;

	onMount(() => {
		if (urlParams.get('s') != null) {
			query = urlParams.get('s');
		}
	});

	const handleSearch = (query: string) => {
		setRoute({ s: query });
	};

	const debounced = debounce(handleSearch, 250);

	function handleClear() {
		setRoute({ s: null });
		query = null;
	}

	function handleInput(query: string | null) {
		query === ('' || null) ? handleClear() : debounced(query);
	}
</script>

<div class="flex flex-row space-x-2">
	<button
		on:click={handleClear}
		class="flex flex-row transition-all duration-200 ease-in-out hover:text-l-pink hover:brightness-50"
	>
		<HeroiconsXCircle20Solid class="mt-[0.2rem] inline-flex" />
	</button>
	<input
		type="text"
		placeholder="search for something..."
		class="rounded-md bg-l-darkpink px-1 py-0.5 text-sm text-l-whitepink transition-colors duration-300 ease-in-out placeholder:p-1 placeholder:py-0.5 placeholder:text-sm placeholder:italic placeholder:text-l-whitepink placeholder:brightness-50 focus:bg-l-whitepink focus:text-l-darkpink"
		bind:value={query}
		on:keydown={(event) => {
			if (event.key === 'Enter') {
				handleInput(query);
			}
		}}
		on:submit={() => handleInput(query)}
	/>
	<button
		on:click={() => handleInput(query)}
		class="flex flex-row transition-all duration-200 ease-in-out hover:text-l-pink hover:brightness-50"
	>
		<HeroiconsMagnifyingGlassCircle16Solid class="mt-[0.2rem] inline-flex" />
	</button>
</div>
