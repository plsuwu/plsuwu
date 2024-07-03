<script lang="ts">
	import type { PageData } from './$types';

	import HeroiconsSparkles from '~icons/heroicons/sparkles';
	import HeroiconsBookOpen from '~icons/heroicons/book-open';

	import PostsMetaLayout from '$components/posts/PostsMetaLayout.svelte';
	import SquareBraceAElement from '$uic/squarebrace/SquareBraceAElement.svelte';
	import SquareBraceText from '$uic/squarebrace/SquareBraceText.svelte';
	import SquareBraceButton from '$components/ui/squarebrace/SquareBraceButton.svelte';

	export let data: PageData;
	let loaded = 5;
	let tags = data.tags;
	let ctfs = data.ctfs;

	$: recent = data.posts.slice(0, loaded);
	function incrLoaded() {
		loaded += 5;
	}
</script>

<div class="flex w-full flex-col">
	<div
		class="mb-12 flex w-full flex-row justify-around self-center font-medium transition-all duration-300 ease-in-out lg:w-1/3"
	>
		<SquareBraceText classMod={''}>
			<div class="mt-px flex flex-row items-center space-x-2 align-bottom">
				<HeroiconsSparkles class="mt-0.5" />
				<div>recent posts</div>
			</div>
		</SquareBraceText>
		<SquareBraceAElement href={'/posts'}>
			<div class="mt-px flex flex-row items-center space-x-2 align-bottom">
				<div>view all posts</div>
				<HeroiconsBookOpen class="mt-0.5" />
			</div>
		</SquareBraceAElement>
	</div>
	<PostsMetaLayout {tags} {ctfs} posts={recent} />

	<div class="mt-12 flex flex-row justify-center self-center lg:w-1/3">
		{#if recent.length < data.posts.length}
			<SquareBraceButton handleParentEvent={incrLoaded}>
				<div class="flex flex-row space-x-2">
					<div class="mt-0.5 inline-flex text-sm">... more?</div>
				</div>
			</SquareBraceButton>
		{:else}
			<SquareBraceText classMod={'opacity-50'}>
				<div class="group flex flex-row space-x-2">
					<div class="group mt-0.5 inline-flex text-sm opacity-50">
						no more posts :{'<'}
					</div>
				</div>
			</SquareBraceText>
		{/if}
	</div>

	<!-- maybe put this on the side, i commit for now... -->
</div>
