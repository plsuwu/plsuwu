<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	import PostsMetaLayout from '$components/posts/PostsMetaLayout.svelte';
	import SquareBraceText from '$components/ui/squarebrace/SquareBraceText.svelte';

	export let data: PageData;
	$: postTypeParams = $page.url.searchParams.get('type');
    $: searchedTermParams = $page.url.searchParams.get('s');
	$: posts = data.posts;
	$: ctfs = data.ctfs;
	$: tags = data.tags;

    // console.log(data);
</script>

<!-- todo:
     -----
        - search,
        - ordering
-->

<div class="flex w-full flex-col">
	<div
		class="my-12 flex w-full flex-col justify-around self-center font-medium transition-all duration-300 ease-in-out lg:w-1/3"
	>
		<SquareBraceText classMod={'text-3xl'}>
			<div class="inline-flex items-center space-x-2 font-semibold text-l-pink/75 brightness-75 text-xl">
				{#key $page.params}
					{#if postTypeParams}
						<div class="">{postTypeParams + 's'}</div>
					{:else}
						<div class="">all posts</div>
					{/if}
				{/key}
			</div>
		</SquareBraceText>
	</div>
	<!-- <div -->
	<!-- 	class="mb-12 flex w-full flex-row justify-around self-center transition-all duration-300 ease-in-out md:w-1/3" -->
	<!-- ></div> -->
	<PostsMetaLayout {posts} {tags} {ctfs} />
</div>
