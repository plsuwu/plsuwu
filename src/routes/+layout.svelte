<script lang="ts">
	import Frame from "$lib/components/frame/Frame.svelte";
	import "../app.css";

	let { children } = $props();
</script>

<Frame />
<div class="h-full w-full">
	{@render children()}
</div>
<div class="invisible mt-4 md:visible">footer :3</div>
