<script lang="ts">
	import '../app.css';
	import SvgSpinnersPulseMultiple from '~icons/svg-spinners/pulse-multiple';
	import Banner from '$components/banner/Banner.svelte';
	import Navigation from '$components/navigation/Navigation.svelte';
	import Footer from '$components/footer/Footer.svelte';
	import PageHead from '$uic/PageHead.svelte';
	import { navigating, page } from '$app/stores';
	import { expoIn, expoInOut, expoOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { afterNavigate } from '$app/navigation';
	import { setNavigatedFrom } from '$utils/store';

	// for whatever reason, calling `$navigating` from here to check on its
	// truthiness (ie, is the user await the `navigating.complete` promise)
	// blocks such that other components cannot correctly read from the `afterNavigate`
	// function like below.
	// we we write it to a shallow cache - this may not be correct as other users may be
	// able to read from it??
	afterNavigate(({ from }) => {
		setNavigatedFrom(`${from?.url.pathname ?? '/'}${from?.url.search}`);
	});
</script>

<PageHead />

<div class="flex min-h-screen flex-col">
	<div class="mb-6 flex flex-col">
		<Banner />
		<Navigation />
	</div>

	{#key $page.url.pathname}
		{#await $navigating?.complete}
			<div
				in:fade={{ delay: 100, duration: 350, easing: expoInOut }}
				class="my-8 flex min-h-full w-full flex-1 flex-col items-center self-center"
			>
				<div class="mb-2 text-xl font-semibold">{'>///<'}</div>
				<div class="mb-12 font-mono text-xs tracking-widest">loading...</div>
				<SvgSpinnersPulseMultiple class="size-48 justify-center" />
			</div>
		{:then}
			<div
				in:fade={{ delay: 100, duration: 350, easing: expoInOut }}
				class="my-8 flex min-h-full w-full flex-1 flex-row justify-center"
			>
				{#key $page.url}
					<slot />
				{/key}
			</div>
		{/await}
	{/key}
	<div class="mt-24">
		<Footer />
	</div>
</div>
