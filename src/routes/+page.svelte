<script lang="ts">
    import type { PageData } from './$types';
	import type { BlogPost } from '$lib/utils/types';
	import PostLayout from '$lib/components/posts/PostLayout.svelte';

    export let data: PageData;
	let recent: BlogPost[] = data.posts;

	if (data.posts) {
		recent = data.posts.sort((a, b) =>
			new Date(a.date) > new Date(b.date) ? -1 : 1
		);
	}
</script>

<div class="flex w-full flex-row items-center justify-center">
	<div class="text-5xl font-extrabold">plsuwu!!</div>

	<div>
    recent posts:
        <PostLayout sortedPosts={recent} />
	</div>
</div>
