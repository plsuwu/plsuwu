<script lang="ts">
	import type { PageData } from './$types';
	import type { BlogPost } from '$lib/utils/types';
	import { blur } from 'svelte/transition';
	import PostLayout from '$lib/components/posts/PostLayout.svelte';
	import { fzf } from '$lib/utils/utils';
	import { expoIn, expoOut } from 'svelte/easing';
	export let data: PageData;

	const noSearchResults: BlogPost = {
		slug: '',
		title: 'no results',
		author: '',
		area: '',
		tags: [''],
		description: '',
		date: '',
		published: true,
	};

	const sortingKeys = ['date', 'title'];
	// const orderingKeys = ['asc', 'des'];

	let sorting = 'date';
	let ordering = 'descending';
	let filtering = 'all';
	let prValue = '';
	let posts: BlogPost[];

	$: posts = apply(data.posts, sorting, ordering, filtering);

	// pull out into two functions so we don't re-apply the filter each time
	// -- for now tho this is so much better than the 27 if/elses i was using prior
	function apply(
		posts: BlogPost[],
		sortingKey: string,
		ordering: string,
		filtering: string
	): BlogPost[] {
		const sorted = posts.sort((a, b) => {
			let comp = 0;
			if (sortingKey === 'date') {
				comp = new Date(a.date).getTime() - new Date(b.date).getTime();
			} else if (sortingKey === 'title') {
				comp = a.title.localeCompare(b.title);
			}

			return ordering === 'descending' ? -comp : comp;
		});

		return filterer(sorted, filtering);
	}

	function filterer(posts: BlogPost[], tag: string): BlogPost[] {
		return tag === 'all' ? posts : posts.filter((post) => post.tags.includes(tag));
	}

	let debounce: number | undefined;
	async function search(
		event: Event & { currentTarget: EventTarget & HTMLInputElement }
	) {
		const { value } = event.target as HTMLInputElement;
		clearTimeout(debounce);
		debounce = setTimeout(async () => {
			if (!value || value === '') {
				posts = apply(data.posts, sorting, ordering, filtering);
			}
			if (value === prValue) {
				let result = fzf(value, posts);
				if (result.some((post) => post.title)) {
					posts = apply(result, sorting, ordering, filtering);
				} else {
					posts = Array(noSearchResults);
				}
			}
		}, 250); // ms
	}
</script>

<div class="flex w-full flex-col justify-center space-y-10 px-6">
	<div class="self-center pb-4 text-5xl font-extrabold">all posts</div>
	<div class="flex w-1/3 flex-row justify-between self-center">
		<div class="flex flex-row space-x-2">
			<input
				type="text"
				class="active:placeholder-shown:false h-8 self-center rounded-md bg-l-darkblue px-2 text-sm text-l-whitepink placeholder:italic"
				placeholder="search for something..."
				bind:value={prValue}
				on:input={(event) => search(event)}
			/>
		</div>
		<div class="flex-0 my-1 border-l border-l-darkpink/55"></div>
		<div>
			<div class="inline-flex justify-end space-x-2 text-xs font-medium">
				<div class="flex flex-col space-y-1">
					<div class="flex flex-row items-center justify-end space-x-2">
						<div>sorting by the [</div>
						<select
							id="sortSelect"
							class="rounded-md px-1 py-0 text-xs bg-l-darkblue text-l-whitepink"
							bind:value={sorting}
							on:load={() => apply(posts, sorting, ordering, filtering)}
							on:change={() => apply(posts, sorting, ordering, filtering)}
						>
							{#each sortingKeys as option}
								<option value={option}>
									{option}
								</option>
							{/each}
						</select>

						<div>] of each post</div>
					</div>
					<div class="inline-flex space-x-2 self-end text-start">
						<div>in</div>
						<button
							class="group inline-flex rounded-md px-0.5 transition-colors duration-200 ease-out hover:bg-l-darkblue"
							on:click={() =>
								(ordering = ordering === 'descending' ? 'ascending' : 'descending')}
						>
							<div
								class="transition-colors duration-200 ease-out group-hover:text-l-whitepink"
							>
								[
							</div>
							<div
								class="rounded-md px-1 opacity-50 transition-colors duration-200 ease-out group-hover:text-l-whitepink group-hover:opacity-100"
							>
								{ordering}
							</div>
							<div
								class="transition-colors duration-200 ease-out group-hover:text-l-whitepink"
							>
								]
							</div>
						</button>

						<span>order</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- {#key posts[0].title && posts[posts.length - 1].title} -->
    <!-- in:blur={{ delay: 100, duration: 500, easing: expoOut }} -->
		<ul
			class="flex w-full flex-col space-y-4 self-center rounded-md sm:max-w-4xl xl:w-[65%]"
		>
			<PostLayout sortedPosts={posts} />
		</ul>
	<!-- {/key} -->
</div>
