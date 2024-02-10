<script lang="ts">
	import { footer } from '$lib/footer/footer';
	import type { SvelteComponent } from 'svelte';

	type IconLoader = () => Promise<{ default: typeof SvelteComponent }>;

	async function loadIcon(getIcon: IconLoader): Promise<typeof SvelteComponent> {
		const component = await getIcon();
		return component.default;
	}
</script>

<footer class="mt-12 w-full bottom-0 text-base p-2 shadow-xl" style={"border-top: 1px solid #e3eaf2;"}>
	<div class="flex flex-row items-center justify-between">
		<div class="mx-12 p-2 text-xs">uwu</div>
		<div class="inline-flex space-x-4 text-cat-subtext0 italic justify-end mx-12 p-2">
			{#each footer as link}
				<ul>
					<li class="hover:text-cat-peach transition-all duration-300 ease-in-out">
						<a href={link.href} target="_blank">
							{#await loadIcon(link.getIcon)}
								<p>{link.placeholder}</p>
							{:then IconComponent}
								<svelte:component this={IconComponent} />
							{/await}
						</a>
					</li>
				</ul>
			{/each}
		</div>
	</div>
</footer>
