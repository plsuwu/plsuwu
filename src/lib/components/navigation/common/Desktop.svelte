<script lang="ts">
	import { pages } from '$utils/navigation';

    import HeroiconsArrowLongRight from '~icons/heroicons/arrow-long-right';
	import Dropdown from './submodules/Dropdown.svelte';
	import NavigationLink from './submodules/NavigationLink.svelte';

	let active = '';
	const toggle = (name: string) => {
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

<div class="flex flex-col w-full items-center p-5">
	<ul use:handleCheckClick class="flex flex-row space-x-8 font-bold">
		{#each pages as page}
			{#if 'children' in page}
				<Dropdown name={page.name} {active} {toggle}>
					{#each page.children as child}
						<NavigationLink
							handleParentEvent={() => toggle(page.name)}
							href={child.href}
						>
							<div
								class="inline-flex w-full justify-between px-4 my-1 border border-l-lightpink p-1 rounded-md mx-2"
							>
								<div>{child.name}</div>
								<HeroiconsArrowLongRight class="inline-flex self-center" />
							</div>
						</NavigationLink>
					{/each}
				</Dropdown>
			{:else}
				<NavigationLink
                    handleParentEvent={() => toggle(active)}
                    href={page.href}
                >
					{page.name}
				</NavigationLink>
			{/if}
		{/each}
	</ul>
</div>
