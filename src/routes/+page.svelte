<script lang="ts">
	import SpinLoader from "$lib/components/loaders/spin/SpinLoader.svelte";
	import List from "$lib/components/postDisplay/List.svelte";
	import CarouselLayout from "$lib/components/postDisplay/carousel/CarouselLayout.svelte";
	import Posts, { type Post } from "$lib/content/import.svelte";
	import { fade } from "svelte/transition";

	const posts = $state(new Posts());

	let featured: Array<Post | null> = $state([null]);
	let loaded = $state(false);

	$effect(() => {
		if (posts.loaded) {
			setTimeout(() => {
				loaded = true;
				featured = posts.posts.slice(0, 3);
			}, 50);
		}
	});
</script>

<div class="h-full overflow-hidden">
	{#if !loaded}
		<div
			transition:fade
			class="flex flex-col items-center justify-center overflow-hidden"
		>
			<SpinLoader />
		</div>
	{:else}
		<div transition:fade class="space-y-8 overflow-hidden">
			<CarouselLayout {featured} />
			<List />
		</div>
	{/if}
</div>
