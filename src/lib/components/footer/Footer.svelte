<script lang="ts">
	import type { IconLink } from '$lib/utils/types';
	import { iconLoader } from '$lib/utils/utils';

	const links: IconLink[] = [
		{
			name: 'github',
			loading: 'gh',
			getIcon: () => import('~icons/ri/github-fill'),
			href: 'https://github.com/plsuwu',
		},
	];
</script>

<div
	class="flex w-full flex-row items-center justify-between bg-l-whitepink/25 px-4 py-6 shadow-inner sm:px-2 sm:py-2"
>
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
