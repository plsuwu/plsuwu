<script lang="ts">
	import SquareBraceAElement from "$uic/squarebrace/SquareBraceAElement.svelte";
	import SquareBraceText from "$uic/squarebrace/SquareBraceText.svelte";

	export let data;
	$: posts = data.posts;


</script>

<div class="flex flex-col w-full">
	<div
		class="flex flex-row w-full md:w-1/3 justify-around transition-all duration-300 ease-in-out self-center mb-12 font-medium"
	>
    <SquareBraceText>
        <div>recent</div>
    </SquareBraceText>
    <SquareBraceAElement href={'/posts'}>
        <div>view all</div>
    </SquareBraceAElement>
	</div>
	<div class="w-full items-center flex flex-col">
		{#each posts as post}
			<div>{post.title}</div>
		{/each}
	</div>
</div>
