<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import type { SvelteComponent } from 'svelte';
	import { onMount } from 'svelte';
	import ReaderSiteNav from '$components/posts/common/tables-of-contents/ReaderSiteNav.svelte';
	import PhoneReaderTop from '$components/posts/common/small-formfactor/PhoneReaderTop.svelte';
	import PhoneReaderBack from '$components/posts/common/small-formfactor/PhoneReaderBack.svelte';
	import ImgModal from '$uic/image/ImgModal.svelte';
	import {
		pipeToClipboard,
		transformMarkup,
		toggleModalState,
		modalState,
	} from '$utils/interaction';

	// i think it makes more sense for these to be here rather than inside
	// the component as its a bit easier to find
	const YPOS_BUTTON_VISIBLE = 365; // px
	const YPOS_INITIAL = 0; // px, just an initializing value

	export let data: PageData;
	type C = $$Generic<typeof SvelteComponent<string, string, string>>;
	$: component = data.component as unknown as C;

	onMount(() => {
		if (typeof document != typeof undefined) {
			transformMarkup(document, $page.url.href);
		}
	});
</script>

<button
	class="hidden"
	on:keydown={(event) => {
        console.log(event);
		if (event.key === 'Escape') {
			toggleModalState();
		}
	}}
>
</button>
<ImgModal />

<div class="flex w-full flex-col items-center">
	<!-- [<- back] for small form fac -->
	<div class="xl:hidden">
		<PhoneReaderBack />
	</div>
	<!-- -->

	<!-- main page content -> handled via mardown-to-markup preprocessor -->
	<div class="w-full px-4 transition-all xl:w-[65%] 3xl:w-[45%]">
		<div class="prose">
			<svelte:component this={component} />
			<slot />
		</div>
	</div>
	<!-- -->

	<!-- regular/"intended" form factor nav (breaks @ XL/1280px & over) -->
	<ReaderSiteNav displayTopScrollAt={YPOS_BUTTON_VISIBLE} yPos={YPOS_INITIAL} />
	<!-- -->

	<!-- [^ top] for small form fac -->
	<div class="mt-24 xl:hidden">
		<PhoneReaderTop />
	</div>
	<!-- -->
</div>
