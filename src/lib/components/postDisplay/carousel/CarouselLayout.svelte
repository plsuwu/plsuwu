<script lang="ts">
	import type { Post } from "$lib/content/import.svelte";
	import CarouselMain from "./CarouselMain.svelte";
	import CarouselSmall from "./CarouselSmall.svelte";
	import { Splide } from "@splidejs/svelte-splide";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	let { featured }: { featured: Array<Post | null> } = $props();
	let posts = $derived(featured);

	let splide: Splide | undefined = $state();
	let splideBarWidth = $state("0%");
	let isLastIndex = $state(false);
	let isFirstIndex = $state(true);

	function updateBarWidth() {
		// retrive the maximum and current positions of the carousel
		let splideIdx = (splide?.splide.index as number) ?? 0;
		let splideEnd = splide?.splide.Components.Controller.getEnd() as number;

		// calculate the current width of the progress bar and convert to a
		// percentage string value to be used as an inline style value in the
		// <Bar /> component
		let rate = Math.min((splideIdx + 1) / (splideEnd + 1), 1);
		splideBarWidth = String(100 * rate) + "%";

		if (splideEnd === splideIdx) {
			//
			// check if we are on the last slide
			isLastIndex = true;
		} else if (splideIdx === 0) {
			// otherwise, check if we are on the first slide
			isFirstIndex = true;
		} else {
			//
			// otherwise, make sure neither flag is set
			if (isLastIndex) {
				isLastIndex = false;
			}
			if (isFirstIndex) {
				isFirstIndex = false;
			}
		}

		console.log(isFirstIndex, isLastIndex);
	}

	onMount(() => {
		updateBarWidth();
	});
</script>

<div
	class="my-18 flex w-full flex-col items-center justify-center lg:w-full md:min-h-[28rem]"
>
	<div
		transition:fade
		class="lg:flex w-[90] h-full hidden object-fill lg:w-[50rem] xl:w-[70rem] 2xl:min-w-[90rem] lg:flex-col rounded-lg border border-black transition-all duration-200 ease-in-out items-center justify-center"
	>
		<CarouselMain
			bind:splide
			bind:barWidth={splideBarWidth}
			update={() => updateBarWidth()}
			{isLastIndex}
			{isFirstIndex}
			{posts}
		/>
	</div>

	<div transition:fade class="lg:hidden">
		<CarouselSmall
			bind:splide
			bind:barWidth={splideBarWidth}
			update={() => updateBarWidth()}
			{isLastIndex}
			{posts}
		/>
	</div>
</div>
