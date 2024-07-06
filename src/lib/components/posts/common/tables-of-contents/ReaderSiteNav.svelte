<script lang="ts">
	import HeroiconsArrowUturnLeft from '~icons/heroicons/arrow-uturn-left';
	import HeroiconsArrowLongUp from '~icons/heroicons/arrow-long-up';
	import SquareBraceButton from '$components/ui/squarebrace/SquareBraceButton.svelte';
	import { scrollToTop } from '$utils/interaction';
	import { navigatedFrom } from '$utils/store';
	import { goto } from '$app/navigation';

	const goBack = () => {
		goto(navigatedFrom);
	};
	export let displayTopScrollAt: number;
	export let yPos: number;
	$: showTopButton = yPos > displayTopScrollAt;

	const handleScrollToTop = () => {
		scrollToTop();
	};
</script>

<div
	class="-ml-38 fixed mt-14 hidden w-1/6 flex-col items-end self-start text-left transition-all delay-150 xl:flex 3xl:w-1/5"
>
	<div class="mb-2 mt-8 text-lg font-bold">nav</div>
	<div class="flex flex-col items-end self-end text-left">
		<SquareBraceButton handleParentEvent={goBack}>
			<div class="mt-1.5 flex flex-row space-x-2 text-xs">
				<HeroiconsArrowUturnLeft class="text-[0.7rem]" />
				<div class="inline-flex justify-center">back</div>
			</div>
		</SquareBraceButton>

		<!-- do we need to check the yPos twice here? -->
		<div
			class={`transition-all duration-300 ease-in-out ${showTopButton ? 'opacity-100' : 'opacity-0'} `}
		>
			<div
				class={`${showTopButton ? 'flex flex-col items-end self-end text-left' : 'hidden'}`}
			>
				<SquareBraceButton handleParentEvent={handleScrollToTop}>
					<div class="mt-1.5 flex flex-row space-x-2 text-xs">
						<HeroiconsArrowLongUp class="text-[0.75rem]" />
						<div class="inline-flex justify-center">top</div>
					</div>
				</SquareBraceButton>
			</div>
		</div>
	</div>
</div>

<svelte:window bind:scrollY={yPos} />
