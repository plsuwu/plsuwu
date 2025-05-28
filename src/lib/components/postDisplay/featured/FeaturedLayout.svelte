<script lang="ts">
	import type { Post } from "$lib/content/import.svelte";
	import { FormatPostMeta } from "$lib/util/util";
	import FeaturedMain from "./FeaturedMain.svelte";
	import FeaturedSmall from "./FeaturedSmall.svelte";

	let { featured }: { featured: Post | null } = $props();
</script>

<div class="hidden lg:flex lg:flex-col items-center justify-center">
	<FeaturedMain {featured} />
</div>

<!-- <div class="flex lg:hidden"> -->
<!--     <FeaturedSmall {featured} /> -->
<!-- </div> -->
