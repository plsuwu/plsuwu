<script lang='ts'>
    // get this stuff componented at some point
	import type { IconPromise } from '$lib/utils/types';

	// import HeroiconsSparkles from '~icons/heroicons/sparkles';
    export let icon: IconPromise | null;
    export let text: string;
</script>
<div class="">[</div>
<div class="rounded-md px-1 text-lg font-semibold">
	<div class="inline-flex">{icon}</div>
	<div class="inline-flex">{text}</div>
</div>
<div class="">]</div>
