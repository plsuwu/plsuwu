<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { pages } from '$lib/navbar/desktop/nav';
	import PhCaretUpBold from 'virtual:icons/ph/caret-up-bold';

	// dropdown state
	let openDropdown = '';

	const toggleDropdown = (name: string) => {
		openDropdown = openDropdown === name ? '' : name;
	};

	// close dropdown when user clicks outside
	const handleClickOutside = (event: MouseEvent) => {
		const path = event.composedPath();
		const isClickInside = path.some((el) => (el as HTMLElement).classList?.contains('dropdown'));

		if (!isClickInside) {
			openDropdown = '';
		}
	};

	// lifecycle hooks
	onMount(() => {
		// document must be loaded before component can mount
		if (typeof window !== 'undefined') {
			document.addEventListener('click', handleClickOutside);
		}
	});
	onDestroy(() => {
		if (typeof window !== 'undefined') {
			document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<div class="flex flex-col bg-cat-crust p-6 shadow-lg font-bold">
	<div class="lg:w-1/2 lg:self-center">
		<ul class="flex flex-row justify-around">
			{#each pages as page (page.name)}
				{#if 'children' in page}
					<li class="relative">
						<button
							class="space-x-4 inline-flex group hover:text-cat-peach transition-colors duration-300 ease-out"
							on:click|stopPropagation={() => toggleDropdown(page.name)}
						>
							<div class="">{page.name}</div>
							<div
								class={`${
									openDropdown === page.name ? 'rotate-180' : 'rotate-0'
								} mt-0.5 inline-flex group-hover:text-cat-peach/50 text-center text-cat-overlay0 transition-transform duration-700 ease-out`}
							>
								<PhCaretUpBold />
							</div>
						</button>
						{#if openDropdown === page.name}
							<div
								class={`absolute bg-cat-crust min-w-[16rem] shadow-xl -ml-[4.5rem] my-3 px-6 py-4 z-10 rounded-xl border border-cat-surface0
                                ${openDropdown === page.name ? 'block' : 'hidden'}`}
								in:fade={{ duration: 200 }}
								out:fade={{ duration: 200 }}
							>
								<ul class="p-4 space-y-4">
									{#each page.children as child}
										<li class="mx-auto">
											<a
												class="hover:text-cat-peach transition-colors duration-300 ease-out"
												href={child.href}
											>
												<span class="text-cat-overlay0">{'[*] '}</span> &nbsp; {child.name}
											</a>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</li>
				{:else}
					<li>
						<a
							class="hover:text-cat-peach transition-colors duration-300 ease-out"
							href={page.href}
						>
							{page.name}
						</a>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
</div>
