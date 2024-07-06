<script lang="ts">
    import SquareBraceButton from '$uic/squarebrace/SquareBraceButton.svelte';
	import HeroiconsArrowUturnLeft from '~icons/heroicons/arrow-uturn-left';
    import { navigatedFrom } from '$utils/store';
    import { goto } from '$app/navigation';

	const goBack = () => {
        goto(navigatedFrom);
	};
</script>

<div class="w-1/5 flex flex-row items-center self-start">
		<SquareBraceButton handleParentEvent={goBack}>
			<div class="mt-1.5 flex flex-row space-x-2 text-xs">
				<HeroiconsArrowUturnLeft class="text-[0.7rem]" />
				<div class="inline-flex justify-center">back</div>
			</div>
		</SquareBraceButton>
</div>

