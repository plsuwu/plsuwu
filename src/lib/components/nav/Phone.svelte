<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import HeroiconsChevronUp20Solid from '~icons/heroicons/chevron-up-20-solid';
	import SolarCloseCircleBold from '~icons/solar/close-circle-bold';
	import HeroiconsArrowSmallRight20Solid from '~icons/heroicons/arrow-small-right-20-solid';
	import HeroiconsBars3BottomLeftSolid from '~icons/heroicons/bars-3-bottom-left-solid';
	import { slide } from 'svelte/transition';
	import { sineInOut } from 'svelte/easing';
	import { pages } from './nav';
	import { expoOut } from 'svelte/easing';

	let sidebarOpen: boolean = false;
	let dropdown = '';

	const openSidebar = () => {
		sidebarOpen = !sidebarOpen;
	};
	const toggle = (name: string) => {
		dropdown = dropdown === name ? '' : name;
	};

	const inDropdown = (event: MouseEvent) => {
		const path = event.composedPath();
		const dropdownPath = path.some((el) =>
			(el as HTMLElement).classList?.contains('dropdown')
		);
		const sidebarPath = path.some((el) =>
			(el as HTMLElement).classList?.contains('sidebar')
		);
		if (!dropdownPath && dropdown !== '') {
			dropdown = '';
		} else if (!sidebarPath) {
			sidebarOpen = false;
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

{#if sidebarOpen}
	<div class="w-screen">
		<div
			class="sidebar fixed z-50 max-h-screen min-h-screen bg-l-whitepink/50 shadow-xl backdrop-blur-sm"
			in:slide={{
				delay: 0,
				duration: 350,
				easing: sineInOut,
				axis: 'x',
			}}
			out:slide={{
				delay: 0,
				duration: 250,
				easing: sineInOut,
				axis: 'x',
			}}
		>
			<button
				in:fade={{ delay: 50, duration: 100 }}
				on:click={openSidebar}
				class="sidebar absolute right-0 z-50 my-4 p-4 text-xl"
			>
				<SolarCloseCircleBold />
			</button>
			<div class="mx-4 my-20 max-h-full flex-row rounded-xl p-6">
				<div class="font-bold">
					<ul class="space-y-6 text-xl">
						{#each pages as page (page.name)}
							{#if 'children' in page}
								<li>
									<button
										on:click={() => toggle(page.name)}
										class="dropdown group flex flex-row items-center space-x-24 p-2"
									>
										<div
											class="transition-all duration-200 group-hover:text-l-pink"
										>
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
											class={`absolute mt-1 rounded-md border bg-white py-2 pl-1 pr-2 shadow-xl backdrop-blur-lg
                                ${dropdown === page.name ? 'block' : 'hidden'}`}
											in:fade={{ duration: 200, easing: expoOut }}
											out:fade={{ duration: 200, easing: expoOut }}
										>
											<ul class="-pr-2 space-y-1 p-0.5">
												{#each page.children as child}
													<li
														class="mx-auto min-w-48 rounded-md border border-pink-200 p-0.5"
													>
														<a
															on:click={() =>
																(sidebarOpen = false)}
															class="flex flex-row items-center justify-between rounded-md px-3 py-1.5 transition-all duration-300 ease-out hover:bg-l-pink hover:text-l-darkpink/55"
															href={child.href}
														>
															{child.name}
															<HeroiconsArrowSmallRight20Solid
																class="text-end text-lg"
															/>
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
										on:click={() => (sidebarOpen = false)}
										class="flex flex-row items-center space-x-2 p-2 transition-all duration-200 hover:text-l-pink"
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
		</div>

		<!-- div to stop clickthrough to posts - i still like the way we use composedPath to find the relevant sidebar elements
        to toggle, so this can be in combination. -->
		<div class="relative h-screen w-screen bg-white opacity-0"></div>
	</div>
{/if}

<div class="fixed z-50 p-8 pl-4 text-xl">
	{#if !sidebarOpen}
		<button
			on:click={openSidebar}
			class="sidebar z-50 rounded-lg p-1"
			in:fade={{ delay: 350, duration: 250 }}
		>
			<HeroiconsBars3BottomLeftSolid class="z-50" />
		</button>
	{/if}
</div>
