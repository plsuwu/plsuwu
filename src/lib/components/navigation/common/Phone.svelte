<script lang="ts">
	import HeroiconsBars3 from '~icons/heroicons/bars-3';
	import HeroiconsXMark from '~icons/heroicons/x-mark';

	let opened: boolean = false;
	const toggle = () => {
		opened = opened ? false : true;
	};
</script>

<div class="absolute left-0 top-0 z-50 p-6 sm:hidden">
	<button on:click={toggle} class="fixed z-[51] overflow-x-hidden">
		{#if opened}
			<HeroiconsXMark class="text-2xl" />
		{:else}
			<HeroiconsBars3 class="text-2xl" />
		{/if}
	</button>

	{#if opened}
		<div
			class="fixed left-0 top-0 z-50 h-[110vh] w-screen overflow-hidden bg-white/50 backdrop-blur-sm"
		>
			<!-- rework the table of contents so they work here
		    (ie, pass the tag/post props through from here + remove the internal tableofcontent breakpoints) -->
		</div>
	{/if}
</div>
