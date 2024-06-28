<script lang="ts">
	import { fetchIcon, links } from '$utils/fetchIcon';
</script>

<div class="mx-auto w-full rounded-xl py-24 text-center lg:max-w-[66%]">
	<div class="mb-2 text-lg font-bold">cybersecurity vagueposts.</div>
	<div class="mb-8 italic opacity-50"></div>
	<div class="my-16 flex flex-col space-y-2">
		{#each links as link}
			<a
				class="group flex flex-row w-1/5 self-center justify-between"
				href={link.href}
				target="_blank"
			>
            <div class="flex flex-row justify-start space-x-2">
				{#await fetchIcon(link.fetchIcon)}
					<div class="inline-flex">
						{link.loading}
					</div>
				{:then Icon}
					<svelte:component
						this={Icon.default}
						class="inline-flex transition-all duration-200 ease-out group-hover:text-l-pink mt-1.5"
					/>
				{/await}
					<div
						class="inline-flex underline transition-all duration-200 ease-out group-hover:text-l-pink group-hover:brightness-75"
					>
						{link.name}
					</div>
				</div>

				<div
					class="justify-end inline-flex transition-all duration-200 ease-out group-hover:text-l-pink opacity-50"
				>
					/plsuwu
				</div>
			</a>
		{/each}
	</div>
</div>
