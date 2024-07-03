<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	import PostsMetaLayout from '$components/posts/PostsMetaLayout.svelte';
	import SquareBraceText from '$components/ui/squarebrace/SquareBraceText.svelte';

	export let data: PageData;
	$: params = $page.url.searchParams.get('type');
	$: posts = data.posts;
	$: ctfs = data.ctfs;
	$: tags = data.tags;
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
		<SquareBraceText classMod={''}>
			<div class="mt-px flex flex-row items-center space-x-2 align-bottom">
				{#key $page.params}
					{#if params}
						<div class="text-center">viewing {params + 's'}</div>
					{:else}
						<div class="text-center">viewing all posts</div>
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
