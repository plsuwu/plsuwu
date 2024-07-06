<script lang="ts">
    import '../app.css';
	import { page } from '$app/stores';
    import { expoInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import Banner from '$components/banner/Banner.svelte';
    import Navigation from '$components/navigation/Navigation.svelte';
    import Footer from '$components/footer/Footer.svelte';
	import PageHead from '$uic/PageHead.svelte';
</script>

<PageHead />

<div class="flex min-h-screen flex-col">
	<div class="mb-6 flex flex-col">
		<Banner />
		<Navigation />
	</div>

	{#key $page.url.pathname}
		<div
			in:fade={{ delay: 150, duration: 300, easing: expoInOut }}
			class="my-8 flex min-h-full w-full flex-1 flex-row justify-center"
		>
			{#key $page.url}
				<slot />
			{/key}
		</div>
	{/key}
	<div class="mt-24">
		<Footer />
	</div>
</div>
