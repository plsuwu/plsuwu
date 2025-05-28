<script lang="ts">
	import FeaturedLayout from "$lib/components/postDisplay/featured/FeaturedLayout.svelte";
	import type { Post } from "$lib/content/import.svelte";
	import Bar from "./Bar.svelte";
	import { Splide, SplideTrack, SplideSlide } from "@splidejs/svelte-splide";
	import cn from "clsx";
	import { ArrowLeft, ArrowRight, X } from "phosphor-svelte";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	let {
		splide = $bindable(),
		barWidth = $bindable(),
		isLastIndex,
		isFirstIndex,
		posts,
		update,
	}: {
		splide: Splide | undefined;
		barWidth: string;
		isLastIndex: boolean;
		isFirstIndex: boolean;
		posts: Array<Post | null>;
		update(): void;
	} = $props();

	onMount(() => {
		update();
	});
</script>

<Splide
	hasTrack={false}
	bind:this={splide}
	on:move={() => update()}
	on:mounted={() => update()}
	Components
	options={{
		padding: "4rem",
		gap: "2em",
		speed: 300,
		pagination: false,
		keyboard: true,
		slideFocus: false,
	}}
	aria-label="Featured posts"
	class="m-2 flex flex-col h-full w-full"
>
	<div
		class="splide__arrows absolute h-full w-full flex flex-row justify-between justify-items-center text-3xl font-bold"
	>
		<button class="splide__arrow splide__arrow--prev z-50"
			><div
				class={cn(
					"brightness-50 transition-all duration-150 w-full h-full flex items-center p-4",
					isFirstIndex ?
						"text-pink-dark/75 cursor-default"
					:	"text-pink-dark hover:brightness-100 cursor-pointer"
				)}
			>
				{#key isFirstIndex}
					<div class="relative" in:fade>
						{#if isFirstIndex}
							<X size={40} />
						{:else}
							<ArrowLeft size={40} />
						{/if}
					</div>
				{/key}
			</div></button
		>
		<button
			class="splide__arrow splide__arrow--next z-50 transition-all duration-200"
			><div
				class={cn(
					"brightness-50 transition-all duration-150 w-full h-full flex items-center p-4",
					isLastIndex ?
						"text-pink-dark/75 cursor-default"
					:	"text-pink-dark hover:brightness-100 cursor-pointer"
				)}
			>
				{#key isLastIndex}
					<div class="relative" in:fade>
						{#if isLastIndex}
							<X size={40} />
						{:else}
							<ArrowRight size={40} />
						{/if}
					</div>
				{/key}
			</div></button
		>
	</div>
	<SplideTrack class="h-full min-w-[16rem] flex flex-col items-center">
		{#each posts as f}
			<SplideSlide class="flex flex-col items-center justify-center mr-8">
				{#if !f}
					<div>broken...</div>
				{:else}
					<div
						class="flex flex-col bg-pink-med items-center justify-center h-full rounded-lg w-full"
					>
						<FeaturedLayout featured={f} />
					</div>
				{/if}
			</SplideSlide>
		{/each}
	</SplideTrack>
</Splide>
<Bar {barWidth} {isLastIndex} />
