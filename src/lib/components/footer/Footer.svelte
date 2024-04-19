<script lang="ts">
	import type { SvelteComponent } from 'svelte';
    import type { IconLink, IconPromise } from '$lib/utils/types';
    import { iconLoader } from '$lib/utils/utils';

	// async function load(getIcon: IconPromise): Promise<typeof SvelteComponent> {
	// 	const component = await getIcon();
	// 	return component.default;
	// }

	const links: IconLink[] = [
		{
			name: 'github',
			loading: 'gh',
			getIcon: () => import('~icons/ri/github-fill'),
			href: 'https://github.com/plsuwu',
		},
	];
</script>

<div class="flex w-full flex-row items-center justify-between px-4 py-6 sm:px-2 sm:py-2 shadow-inner bg-l-whitepink/25">
	<div class="font-mono text-sm italic opacity-50">uwu</div>
	<div class="flex flex-row items-center justify-center space-x-2">
		<div class="font-mono text-sm italic opacity-50">plsuwu @</div>
		<div class="text-lg">{' ['}</div>
		{#each links as link}
			<a href={link.href} class="mt-px">
				{#await iconLoader(link.getIcon)}
					<div>
						{link.loading}
					</div>
				{:then IconComponent}
					<svelte:component
						this={IconComponent}
						class="text-xl transition-all duration-300 ease-out hover:text-l-pink"
					/>
				{/await}
			</a>
		{/each}
		<div class="font-mono text-lg">{'] '}</div>
	</div>
</div>
