<script lang="ts">
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { base } from '$app/paths';
	import HeroiconsArrowLongLeft from '~icons/heroicons/arrow-long-left';

	let previousPage: string = base;
	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage || '/';
	});
</script>

<div class="my-20 flex w-full flex-col">
	<div class="text-center">
		<div class={`opacity text-3xl font-bold text-l-darkpink`}>
			your request couldn't be processed :((
		</div>
		<div
			class={`mt-6 flex flex-row items-center justify-center font-medium text-l-darkpink opacity-90 transition-all duration-1000`}
		>
			server responded with the status code '
			<div class="font-semibold text-red-600">{$page.status}</div>
			' {#if $page.error?.message}
				and  an error message '
				<div class="text-red-700">{$page.error?.message.toLowerCase()}</div>
				'
			{/if}
		</div>
	</div>
</div>
<button
	class="group flex w-full flex-row items-center justify-center space-x-2"
	on:click={() => history.go(-1)}
>
	<div
		class="text-xl opacity-25 transition-all duration-300 ease-out group-hover:opacity-75"
	>
		[
	</div>
	<!-- <HeroiconsArrowLongLeft -->
	<!-- 	class="inline-flex mt-0.5 text-3xl opacity-50 group-hover:opacity-100 transition-all duration-300 ease-out0" -->
	<!-- /> -->
	<div
		class="font-semibold opacity-60 transition-all duration-300 ease-out group-hover:opacity-100"
	>
		go back
	</div>
	<div
		class="text-xl opacity-25 transition-all duration-300 ease-out group-hover:opacity-75"
	>
		]
	</div>
</button>
