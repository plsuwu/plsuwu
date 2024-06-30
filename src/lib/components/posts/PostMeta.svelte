<script lang="ts">
	import type { Post } from '$utils/postLoader';
	import PostButton from './common/PostButton.svelte';
	import PostDescription from './common/PostDescription.svelte';
	import PostDetail from './common/PostDetail.svelte';
	import PostTitle from './common/PostTitle.svelte';

	export let metadata: Post;
	const { slug, description, title, type, from, date, tags } = metadata;
</script>

<div class="flex w-full flex-col rounded-md py-4 lg:my-2">
	<a href={`/posts/${slug}`}>
		<PostButton {slug}>
			<div class="flex w-full flex-col justify-between lg:flex-row">
				<PostTitle {title} {from} />
				<PostDetail {type} {tags} {date} />
			</div>
			<div class="mb-4 ml-1 border-l border-l-pink pb-3 pl-4 pt-2">
				<PostDescription {description} />
			</div>
		</PostButton>
	</a>
</div>
