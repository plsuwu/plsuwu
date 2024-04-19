<script lang="ts">
	import { page, navigating } from '$app/stores';
	import { fade } from 'svelte/transition';
	import SvgSpinnersRingResize from '~icons/svg-spinners/ring-resize';
	import Banner from '$lib/components/banner/Banner.svelte';
	import Nav from '$lib/components/nav/Nav.svelte';
	import '../app.css';
	import Footer from '$lib/components/footer/Footer.svelte';
	import PageHead from '$lib/components/PageHead.svelte';
</script>

<PageHead />
<div class="flex min-h-screen flex-col">
	<div class="mb-4 flex flex-col shadow-md">
		<Banner />
		<Nav />
	</div>

	{#key $page.url}
		{#if $navigating}
			<div
				in:fade={{ delay: 0, duration: 350 }}
				out:fade={{ delay: 0, duration: 100 }}
				class="mb-8 flex min-h-full w-full flex-1 flex-row justify-center lg:my-12"
			>
				<SvgSpinnersRingResize class="text-6xl opacity-75" />
			</div>
		{:else}
			<div
				in:fade={{ delay: 100, duration: 350 }}
				class="mb-8 w-full flex-1 lg:my-12"
			>
				<slot />
			</div>
		{/if}
	{/key}
	<div class="mt-24">
		<Footer />
	</div>
</div>
