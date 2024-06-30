<script lang="ts">
	import SquareBraceAElement from '$components/ui/squarebrace/SquareBraceAElement.svelte';
	import HeroiconsArrowLongRight from '~icons/heroicons/arrow-long-right';

	export let slug;
</script>

<div class="group">
	<slot />
	<div class="flex flex-row justify-end group group-hover:opacity-100">
		<SquareBraceAElement href={`/posts/${slug}`}>
        <div class="inline-flex space-x-2 text-sm">
			<div class="inline-flex">read</div>
			<HeroiconsArrowLongRight class="text-xs inline-flex mt-[0.2rem]" />
        </div>
		</SquareBraceAElement>
	</div>
</div>
