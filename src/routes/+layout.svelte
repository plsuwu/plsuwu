<script lang="ts">
	import { page, navigating } from '$app/stores';
	import { fade } from 'svelte/transition';

	import Banner from '$components/banner/Banner.svelte';
	import Navigation from '$components/navigation/Navigation.svelte';
	import PageHead from '$uic/PageHead.svelte';
	import '../app.css';
	import Footer from '$components/footer/Footer.svelte';
</script>

<PageHead />

<div class="flex min-h-screen flex-col">
	<div class="mb-4 flex flex-col">
		<Banner />
		<Navigation />
	</div>

	{#key $page.url}
		{#if $navigating}
			<div
				in:fade={{ delay: 0, duration: 350 }}
				out:fade={{ delay: 0, duration: 100 }}
				class="mb-8 flex min-h-full w-full flex-1 flex-row justify-center lg:my-12"
			>
				<!-- <SvgSpinnersRingResize class="text-6xl opacity-75" /> -->
			</div>
		{:else}
			<div
				in:fade={{ delay: 100, duration: 350 }}
				class="my-8 w-full flex-1 flex flex-row justify-center"
			>
				<slot />
			</div>
		{/if}
	{/key}
	<div class="mt-24">
		<Footer />
	</div>
</div>
