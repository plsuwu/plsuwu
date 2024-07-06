<script lang='ts'>
    export let tags;
    export let type;
</script>
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
