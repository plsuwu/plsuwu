<script lang="ts">
	import Post from "$components/posts/Post.svelte";

	export let data;

	$: posts = data.posts;
    $: params = data.params;


</script>

<div class="flex w-full flex-col">
	{#if params}
		<div class="text-center text-xl font-bold">{params + 's'}</div>
	{/if}
	<div
		class="mb-12 flex w-full flex-row justify-around self-center transition-all duration-300 ease-in-out md:w-1/3"
	></div>
	<div class="flex w-full flex-col justify-self-center text-center">
		{#each posts as post}
			<div
				class="flex w-1/5 flex-row items-center justify-between space-x-4 space-y-2 self-center text-justify"
			>
            <Post metadata={post} />
			</div>
		{/each}
	</div>
</div>
