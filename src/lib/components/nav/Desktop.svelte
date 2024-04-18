<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import HeroiconsChevronUp20Solid from '~icons/heroicons/chevron-up-20-solid';
    import HeroiconsArrowSmallRight20Solid from '~icons/heroicons/arrow-small-right-20-solid';
	import { pages } from './nav';
	import { expoOut } from 'svelte/easing';

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

<div class="flex w-full flex-col items-center justify-center p-5">
	<ul class="flex flex-row space-x-8 font-bold">
		{#each pages as page}
			{#if 'children' in page}
				<li>
					<button
						on:click={() => toggle(page.name)}
						class="dropdown group flex flex-row items-center space-x-2 p-2"
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
							class={`absolute rounded-md border bg-white/75 py-2 pl-1 pr-2 shadow-xl backdrop-blur-lg
                                ${dropdown === page.name ? 'block' : 'hidden'}`}
                            in:fade={{ duration: 200, easing: expoOut  }}
							out:fade={{ duration: 200, easing: expoOut }}
						>
							<ul class="-pr-2 space-y-1 p-0.5">
								{#each page.children as child}
									<li class="mx-auto min-w-48 border border-pink-200 rounded-md p-0.5">
										<a
                                            class="rounded-md px-3 flex flex-row items-center justify-between py-1.5 transition-all duration-300 ease-out hover:bg-l-pink/35 hover:text-l-darkpink/55"
											href={child.href}
										>
											{child.name}
                                            <HeroiconsArrowSmallRight20Solid class='text-lg text-end'/>
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
