<script lang="ts">
	import '../app.css';
	import { fade } from 'svelte/transition';
	import Nav from '$lib/navbar/desktop/Nav.svelte';
	import SmNav from '$lib/navbar/mobile/SmNav.svelte';
	import Footer from '$lib/footer/Footer.svelte';
	import { page } from '$app/stores';
    import PageHead from '$lib/components/PageHead.svelte';

</script>

<PageHead />

<div class="m-0 flex min-h-screen flex-col">
	<div class="hidden lg:block">
		<Nav />
	</div>

	<div class="fixed lg:hidden">
		<SmNav />
	</div>

	{#key $page.url}

		<div in:fade={{ delay: 0, duration: 350 }} class="my-8 w-full min-w-full flex-1 lg:my-12">
			<slot />
		</div>
	{/key}
	<div class="hidden lg:block">
		<Footer />
	</div>
</div>
