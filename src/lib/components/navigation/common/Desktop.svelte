<script lang="ts">
	import { pages, type Param } from '$utils/navigation';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import HeroiconsArrowLongRight from '~icons/heroicons/arrow-long-right';
	import Dropdown from './submodules/Dropdown.svelte';
	import NavigationLink from './submodules/NavigationLink.svelte';
	import ButtonNavigation from './submodules/ButtonNavigation.svelte';

	let active = '';
	const toggle = (name: string, param?: Param) => {
		if (param) {
			console.log(param);
			// $page.url.searchParams.set({param});
		}
		active = active === name ? '' : name;
	};

	const handleCheckClick = (node: HTMLElement) => {
		const handleClick = (event: MouseEvent) => {
			if (!event.composedPath().includes(node)) {
				active = '';
			}
		};

		document.addEventListener('click', handleClick);
		return {
			destroy() {
				document.removeEventListener('click', handleClick);
			},
		};
	};
</script>

<div class="flex w-full flex-col items-center p-5">
	<ul use:handleCheckClick class="flex flex-row space-x-8 font-bold">
		{#each pages as page}
			{#if 'children' in page}
				<Dropdown name={page.name} {active} {toggle}>
					{#each page.children as child}
						{#if child.href}
							<NavigationLink
								handleParentEvent={() => toggle(page.name)}
								href={child.href}
							>
								<div
									class="mx-2 my-1 inline-flex w-full justify-between rounded-md border border-l-lightpink p-1 px-4"
								>
									<div>{child.name}</div>
									<HeroiconsArrowLongRight
										class="inline-flex self-center"
									/>
								</div>
							</NavigationLink>

						{:else}
							<ButtonNavigation
								handleParentEvent={() => toggle(page.name, child.param)}
							>
								<div
									class="mx-2 my-1 inline-flex w-full justify-between rounded-md border border-l-lightpink p-1 px-4"
								>
									<div>{child.name}</div>
									<HeroiconsArrowLongRight
										class="inline-flex self-center"
									/>
								</div>
							</ButtonNavigation>
						{/if}
					{/each}
				</Dropdown>
			{:else if page.href}
				<NavigationLink handleParentEvent={() => toggle(active)} href={page.href}>
					{page.name}
				</NavigationLink>
			{/if}
		{/each}
	</ul>
</div>
