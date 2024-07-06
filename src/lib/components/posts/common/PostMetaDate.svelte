<script lang="ts">
	export let type: string;
	export let tags: string[];
	export let date: string;

	const formatted = new Date(date).toLocaleDateString();
</script>

<div class="mb-2 flex w-full flex-col justify-end">
	<div class="flex flex-row justify-end space-x-2">
		<div class="font-medium italic"></div>
		<div></div>
		<div>
			<span>{type}&nbsp;&mdash;&nbsp;{'['}</span>{#each tags as tag, i}
				{#if i + 1 === tags.length}
					<a
						href={`/posts?type=ctf&tag=${tag}`}
						class="opacity-50 transition-all duration-300 ease-in-out hover:opacity-100"
						>{tag}</a
					><span>{']'}</span>
				{:else}
					<a
						class="opacity-50 transition-all duration-300 ease-in-out hover:opacity-100"
						href={`/posts?type=ctf&tag=${tag}`}>{tag}</a
					><span>,</span>
				{/if}
			{/each}
		</div>
	</div>
	<div class="flex flex-row justify-end italic">
		posted:&nbsp;<span class="opacity-50">{formatted}</span>
	</div>
</div>
