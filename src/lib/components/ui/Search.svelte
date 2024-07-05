<script lang="ts">
	import HeroiconsXCircle20Solid from '~icons/heroicons/x-circle-20-solid';
    import { page } from '$app/stores';
    import type { Param } from '$utils/navigation';

	import { cache } from '$utils/store';
	import { runSearch, debounce } from '$utils/search';
	import { thisIterInParams } from '$utils/thisIterInParams';
	import { updateParams } from '$utils/param';


	const urlParams = $page.url.searchParams;
	const setRoute = (param?: Param, path?: string) => {
		if (param) {
			Object.entries(param).forEach(([key, val]) => {
				if (!thisIterInParams({ [key]: val }, urlParams)) {
					updateParams({ type: 'ctf', [key]: val }, path ?? undefined);
				} else {
					updateParams({ [key]: null }, path ?? undefined);
				}
			});
		}
	};

    let query: string | null = null;
    if (urlParams.get('s') != null) {
        query = urlParams.get('s');
    }

	const handleSearch = (query: string) => {
		// console.log('searching:', query, `(length of ${query.length})`);
        setRoute({ s: query });
		const result = runSearch(cache.haystack, query);

		return result;
	};

	const debounced = debounce(handleSearch, 250);

	function handleClear() {
        setRoute({ s: null });
        query = null;
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		let res = debounced(target.value);
		console.log(res);
	}
</script>

<div class="flex flex-row space-x-2">
	<button on:click={handleClear}>
		<HeroiconsXCircle20Solid />
	</button>
	<input
		type="text"
		placeholder="search for something..."
		class="rounded-md bg-l-darkpink px-1 py-0.5 text-sm text-l-whitepink transition-colors duration-300 ease-in-out placeholder:p-1 placeholder:py-0.5 placeholder:text-sm placeholder:italic placeholder:text-l-whitepink placeholder:brightness-50 focus:bg-l-whitepink focus:text-l-darkpink"
		bind:value={query}
        on:keydown={(event) => {
                if (event.key === 'Enter') { handleInput(event) }
            }
        }
		on:submit={(event) => handleInput(event)}
	/>
</div>
