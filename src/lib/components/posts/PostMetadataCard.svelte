<script lang="ts">
	import type { Post } from '$utils/post';
	import PostButton from './common/PostButton.svelte';
	import PostMetaDescription from './common/PostMetaDescription.svelte';
	import PostMetaDate from './common/PostMetaDate.svelte';
	import PostMetaTitle from './common/PostMetaTitle.svelte';

	export let metadata: Post;

	const { slug, description, title, type, from, date, tags } = metadata;
</script>

<div class="flex w-full flex-col rounded-md py-4 lg:my-2">
	<a href={`/posts/${slug}`}>
		<PostButton {slug}>
			<div class="flex w-full flex-col justify-between lg:flex-row">
				<PostMetaTitle {title} {from} />
				<PostMetaDate {type} {tags} {date} />
			</div>
			<div class="mb-4 ml-1 border-l border-l-pink pb-3 pl-4 pt-2">
				<PostMetaDescription {description} />
			</div>
		</PostButton>
	</a>
</div>
