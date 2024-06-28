<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	import PostsMetaLayout from '$components/posts/PostsMetaLayout.svelte';
	import { getTocOptions } from '$utils/store';

	export let data: PageData;
    $: params = $page.url.searchParams.get('type');
    $: posts = data.posts;

    $: ctfs = data.ctfs;
    $: tags = data.tags;

</script>

<div class="flex w-full flex-col">
	{#key $page.params}
		{#if params}
			<div class="text-center text-xl font-bold">{params + 's'}</div>
		{:else}
			<div class="text-center text-xl font-bold">all posts</div>
		{/if}
	{/key}
	<div
		class="mb-12 flex w-full flex-row justify-around self-center transition-all duration-300 ease-in-out md:w-1/3"
	></div>
	<PostsMetaLayout {posts} {tags} {ctfs} />
</div>
