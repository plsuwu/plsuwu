<script lang="ts">
	import HeroiconsArrowLongRight from '~icons/heroicons/arrow-long-right';
	import Dropdown from './submodules/Dropdown.svelte';
	import NavigationLink from './submodules/NavigationLink.svelte';
	import ButtonNavigation from './submodules/ButtonNavigation.svelte';
    import { updateParams, type Param } from '$utils/param';
	import { pages } from '$utils/navigation';

	let active = '';
	const route = (name: string, param?: Param, path?: string) => {
		if (param) {
			updateParams({ type: param.type }, path);
		}

		active = active === name ? '' : name;
		return active;
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

<div class="bg-l-bgf/65 flex w-full flex-col items-center p-3">
	<ul use:handleCheckClick class="flex flex-row space-x-8 font-bold">
		{#each pages as page}
			{#if 'children' in page}
				<Dropdown name={page.name} {active} handleParentEvent={route}>
					{#each page.children as child}
						{#if !child.param && child.href}
							<NavigationLink
								handleParentEvent={() =>
									route(page.name, child.param, child.href)}
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
						{:else if child.param}
							<ButtonNavigation
								handleParentEvent={() =>
									route(page.name, child.param, child.href)}
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
				<NavigationLink handleParentEvent={() => route(active)} href={page.href}>
					{page.name}
				</NavigationLink>
			{/if}
		{/each}
        <a href='https://tiles.plsuwu.com' target='_blank' referrerpolicy="no-referrer">
            tiles
        </a>
	</ul>
</div>
