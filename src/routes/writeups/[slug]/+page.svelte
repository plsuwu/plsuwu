<script lang="ts">
	import type { PageData } from './$types';
	import type { SvelteComponent } from 'svelte';
	// import ArticleMeta from '$lib/components/ArticleMeta.svelte';
	import PhArrowLeft from 'virtual:icons/ph/arrow-left';

	export let data: PageData;

	type C = $$Generic<typeof SvelteComponent<string, string, string>>;
	$: component = data.component as unknown as C;
</script>

<div class="mt-28 lg:mt-0 w-full flex flex-col">
	<div class="self-center shadow-inner w-full bg-cat-mantle py-10">
		<div class="text-cat-text text-center font-bold my-10">
			<div class="text-6xl lg:text-3xl text-center my-8 font-bold text-cat-overlay0">
				<!-- {data.frontmatter.title} -->
			</div>
			<div class="flex flex-col w-full">
				<div class="mx-auto text-center space-x-5">
					<div class="inline-flex align-middle">
						<a
							href="/writeups"
							class="text-xl text-cat-peach hover:opacity-50 transition-opacity duration-300 ease-in-out space-x-4"
							><PhArrowLeft class="inline" /><span
								class="text-cat-overlay0 font-normal underline text-base">back to writeups</span
							></a
						>
					</div>

					<div class="inline-flex text-cat-overlay0">
						<!--
                        <ArticleMeta author={data.frontmatter.author} date={data.frontmatter.date} />
                        -->
					</div>
				</div>
			</div>
		</div>

		<div
			class="mt-12 text-cat-text min-w-3xl max-w-6xl 2xl:max-w-[1920px] rounded-xl mx-auto bg-cat-crust"
		>
			<!-- todo: need to triple check custom prose style -->
			<div class="text-lg lg:text-sm p-12 space-y-8 mx-8 text-justify prose">
				<svelte:component this={component} />

				<slot />
			</div>
		</div>
	</div>
</div>
