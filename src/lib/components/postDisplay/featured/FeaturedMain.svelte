<script lang="ts">
	import type { Post } from "$lib/content/import.svelte";
	import {
		FormatDate as DateFmt,
		FormatPostMeta as MetaFmt,
	} from "$lib/util/util";
	import { AspectRatio } from "bits-ui";

	let { featured }: { featured: Post | null } = $props();
	const text =
		"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
		"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
		"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
		"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

	const excerpt = MetaFmt.truncate(featured?.excerpt, 128);
</script>

{#if featured === null}
	<div>Seems like there was an issue while loading this post ://</div>
{:else}
	<div class="flex flex-col overflow-hidden items-center">
		<div class="grid grid-cols-2">
			<div class="flex w-full flex-col h-full justify-center">
				<AspectRatio.Root
					ratio={12 / 10}
					class="scale-[0.80] rounded-lg bg-transparent grayscale-75 hover:grayscale-0 transition-discrete duration-200 ease-in-out"
					><a href={`/post/${featured.slug}`}>
						<img
							src={featured.cover}
							alt="featured cover"
							class="h-full w-full overflow-hidden rounded-xl object-cover"
						/>
					</a>
				</AspectRatio.Root>
			</div>
			<div class="flex flex-col h-full">
				<div
					class="rounded-15px h-full bg-transparent my-1 xl:my-10 2xl:my-20"
				>
					<div
						class="mx-2 lg:mx-6 flex flex-col py-2 lg:py-8 justify-start h-full"
					>
						<div>
							<div
								class="flex flex-row justify-between mr-4 items-center align-text-bottom"
							>
								<div
									class="font-display text-xl font-bold xl:text-4xl italic text-nowrap"
								>
									{featured.title}
								</div>
								<div
									class="text-sm mt-0.5 xl:mt-3 font-extralight xl:font-normal xl:text-base"
								>
									{DateFmt.fmt(featured.date)}
								</div>
							</div>
						</div>
						<p
							class="w-[16rem] xl:w-[32rem] block text-base xl:text-lg text-black/60 xl:max-w-full break-words mt-2"
						>
							{excerpt}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
