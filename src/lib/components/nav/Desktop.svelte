<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import HeroiconsChevronUp20Solid from '~icons/heroicons/chevron-up-20-solid';
	import { pages } from './nav';

	let dropdown = '';

	const toggle = (name: string) => {
		dropdown = dropdown === name ? '' : name;
	};

	const inDropdown = (event: MouseEvent) => {
		const path = event.composedPath();
		const dropdownPath = path.some((el) =>
			(el as HTMLElement).classList?.contains('dropdown')
		);

		if (!dropdownPath) {
			dropdown = '';
		}
	};

	onMount(() => {
		if (typeof window !== 'undefined') {
			document.addEventListener('click', inDropdown);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			document.removeEventListener('click', inDropdown);
		}
	});
</script>

<div class="flex w-full flex-col items-center justify-center p-6">
	<ul class="flex flex-row space-x-8 font-bold">
		{#each pages as page}
			{#if 'children' in page}
				<li>
					<button
						on:click={() => toggle(page.name)}
						class="group flex flex-row items-center space-x-2 p-2 dropdown"
					>
						<div class="transition-all duration-200 group-hover:text-l-pink">
							{page.name}
						</div>
						<div
							class={`${dropdown === page.name ? 'rotate-180 text-l-pink brightness-[80%]' : 'group-hover:text-l-pink'} mt-1 inline-flex transition-all duration-300`}
						>
							<HeroiconsChevronUp20Solid />
						</div>
					</button>
					{#if dropdown === page.name}
						<div
							class={`absolute rounded-md border backdrop-opacity-25 pr-2 pl-1 py-2 shadow-xl backdrop-blur-sm
                                ${dropdown === page.name ? 'block' : 'hidden'}`}
							in:fade={{ duration: 200 }}
							out:fade={{ duration: 200 }}
						>
							<ul class="space-y-4 p-1 -pr-2">
								{#each page.children as child}
									<li class="mx-auto">
										<a
											class="hover:bg-l-whitepink py-1 pl-2 pr-8 text-start rounded-lg transition-all duration-200 hover:text-l-pink"
											href={child.href}
										>
											{child.name}
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
						href={page.href}
						class="flex flex-row items-center space-x-2 p-2 transition-all duration-200 hover:text-l-pink"
					>
						{page.name}
					</a>
				</li>
			{/if}
		{/each}
	</ul>
</div>
