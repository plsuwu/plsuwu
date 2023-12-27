<script lang="ts">
	import BanOne from '$lib/banner/BanOne.svelte';
	// import Bof from '$lib/banner/Bof.svelte';
	import type { PageData } from './$types';
	import Article from '$lib/components/Article.svelte';
	import ArticleTitle from '$lib/components/ArticleTitle.svelte';
	import ArticleMeta from '$lib/components/ArticleMeta.svelte';
	import ArticleDescription from '$lib/components/ArticleDescription.svelte';
	export let data: PageData;

	import PhArrowRight from 'virtual:icons/ph/arrow-right';
</script>

<div class="mx-auto mt-14 flex w-full flex-col lg:mt-0">
	<div class="w-full self-center bg-cat-mantle pb-12 pt-5 shadow-inner">
		<div class="mt-6 text-center font-bold text-cat-text lg:mb-12 lg:mt-8">
			<BanOne />
		</div>
		<div class=" mt-12 rounded-xl bg-cat-crust text-cat-text lg:mt-0 2xl:mx-72">
			<div class="space-y-8 p-8 text-justify text-lg lg:text-xl w-full">
				<div class="my-4 text-center text-4xl font-bold text-cat-overlay0 lg:text-3xl w-full">pls' blog</div>
				<div class=" my-4 text-sm w-full text-cat-overlay0 md:text-xl flex">
                        <div class="w-full flex  justify-between">
					<div class="text-start text-lg md:text-xl">recent posts:</div>
					<div class="text-end">
						<a
							href="/writeups"
							class="italic my-4 text-end text-base text-cat-surface0 md:text-xl hover:text-cat-peach/50 transition-all duration-200 ease-out"
							><span>view all</span> <PhArrowRight class="inline-flex" /></a
						>
					</div>
                </div>
				</div>
				<div>
					<div
						class="mx-auto flex flex-col px-4 text-sm sm:text-xl lg:space-y-0 lg:p-8 2xl:grid 2xl:grid-cols-3 pt-2 pb-6 max-w-[1300px]"
					>
						{#each data.posts as { slug, title, author, description, date }}
							<div class="lg:mx-2 my-0 overflow-hidden">
								<Article {slug}>
									<ArticleTitle {slug} {title} />
									<ArticleMeta {author} {date} />
									<ArticleDescription {description} />
								</Article>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
