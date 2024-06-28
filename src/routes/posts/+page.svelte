<script lang="ts">
	export let data;

	$: posts = data.posts;
	$: postType = data.params;

	console.log(postType);
</script>

<div class="flex flex-col w-full">
	{#if postType}
		<div class="text-center font-bold text-xl">{postType + 's'}</div>
	{/if}
	<div
		class="flex flex-row w-full md:w-1/3 justify-around transition-all duration-300 ease-in-out self-center mb-12"
	></div>
	<div class="w-full  justify-self-center text-center flex flex-col">
		{#each posts as post}
			<div class="text-justify items-center flex flex-row space-x-4 justify-between self-center w-1/5 space-y-2">
				<div>{post.title}</div>
				<div>{post.from}</div>
			</div>
		{/each}
	</div>
</div>
