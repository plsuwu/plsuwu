<script lang="ts">
	import HeroiconsArrowUturnLeft from '~icons/heroicons/arrow-uturn-left';
	import HeroiconsArrowLongUp from '~icons/heroicons/arrow-long-up';
    import SquareBraceButton from '$components/ui/squarebrace/SquareBraceButton.svelte';
    import { base } from '$app/paths';
    import { goto, afterNavigate } from '$app/navigation';
	import { scrollToTop } from '$utils/interaction';

    export let displayTopScrollAt: number;
    export let yPos: number;

	let previousPage: string = base;
	const handleScrollToTop = () => {
		scrollToTop();
	};

    // push any url params in the referring url to the window history if they exist,
    // such that we can navigate back to the previous page with all the applied filters,
    // or the base url if the referring url did not define any params
	afterNavigate(({ from }) => {
		let prevParams = from?.url.searchParams;
		previousPage = `${from?.url.pathname || previousPage}?${prevParams}`;
	});

    // call a goto on the referring URL when the user clicks the `[<- back]` button
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

		<!-- do we need to check the yPos twice here? -->
		<div
			class={`transition-all duration-300 ease-in-out ${yPos > displayTopScrollAt ? 'opacity-100' : 'opacity-0'} `}
		>
			<div
				class={`${yPos > displayTopScrollAt ? 'flex flex-col items-end self-end text-left' : 'hidden'}`}
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
