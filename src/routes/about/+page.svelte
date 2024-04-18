<script lang="ts">
	import type { IconLink } from '$lib/utils/types';
	import { iconLoader } from '$lib/utils/utils';

	const offsite: IconLink[] = [
		{
			name: 'github.com/plsuwu',
			href: 'https://github.com/plsuwu',
			getIcon: () => import('~icons/ri/github-fill'),
            loading: 'gh',
		},
		{
			name: 'soundcloud.com/notpls',
			href: 'https://soundcloud.com/notpls',
			getIcon: () => import('~icons/ri/soundcloud-line'),
			loading: 'sc',
		},
	];
</script>

<div class="mt-18 w-full flex-col lg:mt-0">
	<div class="mx-auto w-full rounded-xl py-36 text-center lg:max-w-[66%]">
		<div class="mb-2 text-lg font-semibold">cybersecurity vagueposts.</div>
		<div class="mb-8 italic opacity-50"></div>
		<div class="my-12 flex flex-col space-y-2">
			{#each offsite as link}
				<a class="group" href={link.href}>
					{#await iconLoader(link.getIcon)}
						<div>
							{link.loading}
						</div>
					{:then IconComponent}
						<svelte:component
							this={IconComponent}
							class="inline-flex transition-all duration-200 ease-out group-hover:text-l-pink"
						/>
					{/await}
					<span
						class="inline-flex underline transition-all duration-200 ease-out group-hover:text-l-pink group-hover:brightness-75"
						>{link.name}</span
					>
				</a>
			{/each}
		</div>
	</div>
</div>
