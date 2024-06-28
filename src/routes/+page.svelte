<script lang="ts">
    import type { PageData } from './$types';

    import HeroiconsSparkles from '~icons/heroicons/sparkles';
    import HeroiconsBookOpen from '~icons/heroicons/book-open';

	import PostsMetaLayout from '$components/posts/PostsMetaLayout.svelte';
	import SquareBraceAElement from '$uic/squarebrace/SquareBraceAElement.svelte';
	import SquareBraceText from '$uic/squarebrace/SquareBraceText.svelte';

	export let data: PageData;
	$: posts = data.posts;
    let tags = data.tags;
    let ctfs = data.ctfs;

</script>

<div class="flex w-full flex-col">
	<div
		class="mb-12 flex w-full flex-row justify-around self-center font-medium transition-all duration-300 ease-in-out md:w-1/3"
	>
		<SquareBraceText classMod={''}>
        <div class="flex flex-row space-x-2 items-center align-bottom mt-px">
            <HeroiconsSparkles class="mt-0.5" />
			<div>recent</div>
        </div>
		</SquareBraceText>
		<SquareBraceAElement href={'/posts'}>
        <div class="flex flex-row space-x-2 items-center align-bottom mt-px">
			<div>view all</div>
            <HeroiconsBookOpen class="mt-0.5" />
        </div>
		</SquareBraceAElement>
	</div>
	<PostsMetaLayout {tags} {ctfs} {posts} />
</div>
