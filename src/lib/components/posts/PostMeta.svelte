<script lang="ts">
	import type { Post } from '$utils/postLoader';
	import PostDescription from './common/PostDescription.svelte';
	import PostDetail from './common/PostDetail.svelte';
	import PostTitle from './common/PostTitle.svelte';

    // export let idx: number;
	export let metadata: Post;

	const slug = metadata.slug;
	const description = metadata.description;

	const title = metadata.title;
	const type = metadata.type;
	const from = metadata.from;
	const date = metadata.date;
	const tags = metadata.tags;
</script>

<div class="my-2 flex w-full flex-col rounded-md p-4">
	<a href={`/posts/${slug}`}>
		<div class="flex w-full flex-row justify-between">
			<PostTitle {title} {from} />
			<PostDetail {type} {tags} {date} />
		</div>

		<div class="ml-1 border-l border-l-pink py-2 pl-4">
			<PostDescription {description} />
		</div>
	</a>
</div>
