<script lang="ts">
	import Post from "$components/posts/Post.svelte";
import SquareBraceAElement from "$uic/squarebrace/SquareBraceAElement.svelte";
	import SquareBraceText from "$uic/squarebrace/SquareBraceText.svelte";

	export let data;
	$: posts = data.posts;

</script>

<div class="flex flex-col w-full">
	<div
		class="flex flex-row w-full md:w-1/3 justify-around transition-all duration-300 ease-in-out self-center mb-12 font-medium"
	>
    <SquareBraceText classMod={''}>
        <div>recent</div>
    </SquareBraceText>
    <SquareBraceAElement href={'/posts'}>
        <div>view all</div>
    </SquareBraceAElement>
	</div>
	<div class="flex w-full flex-col justify-self-center text-center">
		{#each posts as post}
			<div
				class="flex w-full px-8 sm:px-0 sm:w-[70%] 2xl:w-[45%] max-w-[725px] min-w-[380px] flex-row items-center justify-between space-x-4 space-y-2 self-center text-justify"
			>
            <Post metadata={post} />
			</div>
		{/each}
	</div>
</div>
