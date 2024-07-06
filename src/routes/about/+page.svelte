<script lang="ts">
	import { fetchIcon, links } from '$utils/navigation';
</script>

<div class="mx-auto w-full rounded-xl py-12 xl:py-24 text-center lg:max-w-[66%]">
	<div class="mb-2 text-lg font-bold">cybersecurity vagueposts.</div>
	<div class="my-8 xl:my-16 flex flex-col space-y-2">
		{#each links as link}
			<a
				class="group flex w-1/2 flex-row items-center justify-between justify-items-stretch self-center xl:w-1/5"
				href={link.href}
				target="_blank"
			>
				<div class="flex flex-row justify-start space-x-2">
					<div class="inline-flex w-full justify-self-center justify-items-center text-start">
						{#await fetchIcon(link.fetchIcon)}
							<div class="inline-flex self-start">
								{link.loading}
							</div>
						{:then Icon}
							<svelte:component
								this={Icon.default}
								class="mt-1.5 inline-flex transition-all duration-200 ease-out group-hover:text-l-pink"
							/>
						{/await}
						<div
							class="inline-flex underline transition-all duration-200 ease-out group-hover:text-l-pink group-hover:brightness-75"
						>
							{link.name}
						</div>
					</div>
				</div>
				<div
					class="inline-flex justify-end opacity-50 transition-all duration-200 ease-out group-hover:text-l-pink group-hover:opacity-100"
				>
					<div>/plsuwu</div>
				</div>
			</a>
		{/each}
	</div>
</div>
