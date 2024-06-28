<script lang="ts">
    import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { base } from '$app/paths';
	import SquareBraceButton from '$uic/squarebrace/SquareBraceButton.svelte';

    function nav_back() {
        if (browser) window.history.back();
    }
	let previousPage: string = base;
	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname ?? '/';
	});
</script>

<div class="my-20 flex w-full flex-col justify-self-center justify-items-center">
	<div class="text-center mb-12">
		<div class={`opacity text-3xl font-bold text-l-darkpink/50`}>
			your request couldn't be processed :((
		</div>
		<div
			class={`mt-6 flex flex-row items-center justify-center font-medium text-l-darkpink opacity-90 transition-all duration-1000`}
		>
			server responded with the status code '
			<div class="font-semibold text-red-600">{$page.status}</div>
			'{#if $page.error?.message !== ''}
				<div class="flex flex-row justify-center items-center">
					&nbsp;(and an error message: '
					<div class="text-red-700">
						{$page.error?.message.toLowerCase()}
					</div>
					')
				</div>
			{/if}
		</div>
	</div>
	<SquareBraceButton handleParentEvent={nav_back}>
		<div>go back</div>
	</SquareBraceButton>
</div>
