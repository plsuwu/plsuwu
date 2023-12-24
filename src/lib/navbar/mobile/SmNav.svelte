<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, slide } from 'svelte/transition';
import { pages } from '$lib/navbar/desktop/nav';
	import PhTextIndentBold from 'virtual:icons/ph/text-indent-bold';
	import PhTextOutdentBold from 'virtual:icons/ph/text-outdent-bold';
	import PhCaretUpBold from 'virtual:icons/ph/caret-up-bold';
	import { sineInOut } from 'svelte/easing';

    // dropdown + sidebar state
	let sidebarOpen: boolean = false;
	let openDropdown = '';

	const toggleDropdown = (name: string) => {
		openDropdown = openDropdown === name ? '' : name;
	};

	const openSidebar = () => {
		sidebarOpen = !sidebarOpen;
	};

	// close dropdown when user clicks another element
	const handleClickOutside = (event: MouseEvent) => {
		const path = event.composedPath();
		const isClickInside = path.some((el) => (el as HTMLElement).classList?.contains('dropdown'));
    const isClickInsideSB = path.some((el) => (el as HTMLElement).classList?.contains('sidebar'));

		if (!isClickInside && openDropdown !== '') {
			openDropdown = '';
    }
    else if (!isClickInsideSB) {
        sidebarOpen = false;
    };
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


{#if sidebarOpen}
	<div class="w-screen">
		<div class="fixed min-h-screen max-h-screen  bg-cat-crust/75 shadow-xl sidebar"
      in:slide={{ delay: 0, duration: 350, easing: sineInOut, axis: 'x' }}
      out:slide={{ delay: 0, duration: 250, easing: sineInOut,axis: 'x' }}
    >
    <button in:fade={{ delay: 50, duration: 100 }} on:click={openSidebar} class="right-0 absolute p-4 text-xl my-4 text-cat-overlay2 z-10 sidebar">
			<PhTextOutdentBold />
		</button>
      <div class="bg-cat-base max-h-full rounded-xl flex-row my-20 mx-4 p-6">
				<div class="font-bold">
					<ul class="text-xl space-y-6">
						{#each pages as page (page.name)}
							{#if 'children' in page}
								<li class="relative">
									<button
										class="space-x-24 inline-flex justify-around group hover:text-cat-peach transition-colors duration-300 ease-out"
										on:click|stopPropagation={() => toggleDropdown(page.name)}
									>
										<div class="">{page.name}</div>
										<div
											class={`${
												openDropdown === page.name ? 'rotate-180' : 'rotate-0'
											} mt-0.5 inline-flex group-hover:text-cat-peach/50  text-cat-overlay0 transition-transform duration-700 ease-out`}
										>
											<PhCaretUpBold />
										</div>
									</button>
									{#if openDropdown === page.name}
										<div
							    	  class={`my-4 -ml-8 absolute bg-cat-crust min-w-[14rem] shadow-xl px-2 z-10 rounded-xl border border-cat-surface0
                                ${openDropdown === page.name ? 'block' : 'hidden'}`}
											in:fade={{ duration: 200 }}
											out:fade={{ duration: 200 }}
										>
											<ul class="p-8 space-y-16">
												{#each page.children as child}
													<li class="mx-auto">
														<a
                              on:click={() => (sidebarOpen = false)}
															class="hover:text-cat-peach transition-colors duration-300 ease-out text-base"
															href={child.href}
														>
														<span class="text-cat-overlay0">{"[*] "}</span> {child.name}
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
		</div>
	</div>
{/if}

<div class="fixed p-8 pl-4 text-xl text-cat-overlay2 z-10">
	{#if !sidebarOpen}
		<button on:click={openSidebar} class='sidebar bg-cat-crust/50 p-1 rounded-lg'
      in:fade={{ delay: 350, duration: 250 }}>

			<PhTextIndentBold />
		</button>
	{/if}
</div>
