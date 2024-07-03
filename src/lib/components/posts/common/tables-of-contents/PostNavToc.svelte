<script lang="ts">
	import HeroiconsArrowUturnLeft from '~icons/heroicons/arrow-uturn-left';
	import HeroiconsArrowLongUp from '~icons/heroicons/arrow-long-up';
	import { goto, afterNavigate } from '$app/navigation';
	import { base } from '$app/paths';

	import SquareBraceButton from '$components/ui/squarebrace/SquareBraceButton.svelte';
	import { scrollToTop } from '$utils/scrollToTop';

	const DISPLAY_BUTTON_YPOS = 365;
	let previousPage: string = base;
	let yPos = 0;

	const handleScrollToTop = () => {
		scrollToTop();
	};

	afterNavigate(({ from }) => {
		let prevParams = from?.url.searchParams;
		previousPage = `${from?.url.pathname || previousPage}?${prevParams}`;
	});

	const goBack = () => {
		goto(previousPage);
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

		<!-- does this need to be a double `if` check here?? needs to be refactored -->
		<div
			class={`transition-all duration-300 ease-in-out ${yPos > DISPLAY_BUTTON_YPOS ? 'opacity-100' : 'opacity-0'} `}
		>
			<div
				class={`${yPos > DISPLAY_BUTTON_YPOS ? 'flex flex-col items-end self-end text-left' : 'hidden'}`}
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
