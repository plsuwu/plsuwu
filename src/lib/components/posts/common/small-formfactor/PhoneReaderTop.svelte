<script lang="ts">
	import SquareBraceButton from '$uic/squarebrace/SquareBraceButton.svelte';
	import HeroiconsArrowLongUp from '~icons/heroicons/arrow-long-up';
	import { scrollToTop } from '$utils/interaction';

	const handleScrollToTop = () => {
		scrollToTop();
	};
</script>

<SquareBraceButton handleParentEvent={handleScrollToTop}>
	<div class="mt-1.5 flex flex-row space-x-2 text-xs">
		<HeroiconsArrowLongUp class="text-[0.75rem]" />
		<div class="inline-flex justify-center">top</div>
	</div>
</SquareBraceButton>
