<script lang="ts">
	import { page, navigating } from '$app/stores';
	import { fade } from 'svelte/transition';

	import Banner from '$components/banner/Banner.svelte';
	import Navigation from '$components/navigation/Navigation.svelte';
	import PageHead from '$uic/PageHead.svelte';
	import '../app.css';
	import Footer from '$components/footer/Footer.svelte';
	import { expoInOut } from 'svelte/easing';
</script>

<PageHead />

<div class="flex min-h-screen flex-col">
	<div class="mb-4 flex flex-col">
		<Banner />
		<Navigation />
	</div>

	{#key $page.url}
		<div
			in:fade={{ delay: 100, duration: 200, easing: expoInOut }}
			class="my-8 flex min-h-full w-full flex-1 flex-row justify-center"
		>
			<slot />
		</div>
	{/key}
	<div class="mt-24">
		<Footer />
	</div>
</div>
