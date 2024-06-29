<script lang="ts">
	import type { Post } from '$utils/postLoader';
	import PostDescription from './common/PostDescription.svelte';
	import PostDetail from './common/PostDetail.svelte';
	import PostTitle from './common/PostTitle.svelte';

	export let metadata: Post;
    const { slug, description, title, type, from, date, tags } = metadata;
</script>

<div class="lg:my-2 flex w-full flex-col rounded-md py-4">
	<a href={`/posts/${slug}`}>
		<div class="flex w-full flex-col lg:flex-row justify-between">
			<PostTitle {title} {from} />
			<PostDetail {type} {tags} {date} />
		</div>
		<div class="ml-1 border-l border-l-pink pt-2 pb-3 mb-4 pl-4">
			<PostDescription {description} />
		</div>
	</a>
</div>
