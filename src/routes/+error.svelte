<script lang="ts">
	import { page } from '$app/stores';
    import { goto, afterNavigate } from '$app/navigation';
    import { base } from '$app/paths';
    import HeroiconsArrowLongLeft from '~icons/heroicons/arrow-long-left';

	let previousPage: string = base;
	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage || '/';
	});

</script>

<div>
	<div class="mx-auto my-20 flex w-full flex-col">
		<div class="text-center">
			{#if $page.status === 500}
				<div
					class={`text-lightpink my-10 text-xl italic transition-all duration-1000`}
				>
					server undergoing maintenance - this usually doesn't take long! <br />
					try again in 5 to 10 minutes.
				</div>
			{:else}
				<div class={`opacity text-3xl font-bold text-l-darkpink`}>
					the server couldn't process your request.
				</div>
				<div
					class={`mt-6 italic text-l-darkpink opacity-90 transition-all duration-1000`}
				>
					responded with status '<span class="font-semibold text-red-400"
						>{$page.status}</span
					>' ({$page.error?.message.toLowerCase()})
				</div>
			{/if}
		</div>
	</div>
	<a class="group transition-all duration-300 ease-out hover:text-l-pink" href={previousPage}>
		{#if $page.status !== 500}
			<div class="flex flex-col items-center justify-center">
				<div
					class="inline-flex w-1/3 items-center justify-center space-x-8 self-center text-2xl hover:text-l-pink"
				>
					<HeroiconsArrowLongLeft class="mt-0.5 text-3xl" />
					<div class="font-semibold">go back</div>
				</div>
			</div>
		{/if}
	</a>
</div>
