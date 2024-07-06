<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import PostsMetadataLayout from '$components/posts/PostsMetadataLayout.svelte';
	import SquareBraceText from '$components/ui/squarebrace/SquareBraceText.svelte';

	export let data: PageData;
	$: postTypeParams = $page.url.searchParams.get('type');
	$: posts = data.posts;
	$: ctfs = data.ctfs;
	$: tags = data.tags;

    // console.log(data);
</script>

<div class="flex w-full flex-col">
	<div
		class="mb-12 flex w-full flex-col justify-around self-center font-medium transition-all duration-300 ease-in-out lg:w-1/3"
	>
		<SquareBraceText classMod={''}>
			<div class="inline-flex items-center space-x-2 font-semibold">
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
	<PostsMetadataLayout {posts} {tags} {ctfs} />
</div>
