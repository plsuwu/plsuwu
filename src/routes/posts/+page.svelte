<script lang="ts">
	import type { PageData } from './$types';
	import type { BlogPost } from '$lib/utils/types';
	import PostLayout from '$lib/components/posts/PostLayout.svelte';

	const sortOptions = ['new -> old', 'old -> new', 'a-z', 'z-a'];

	export let data: PageData;
	let filterParams = 'all';
	$: sortBy = sortOptions[0];
	let sortedPosts: BlogPost[];
	$: sortedPosts = sortPosts(sortBy);


    /**
     * make this chunk of if/elses tidier (cant be bothered atm)
    */

	function sortPosts(sort: string): BlogPost[] {
		let sorted: BlogPost[];

		// new to old
		if (sort === sortOptions[0]) {
			sorted = data.posts.sort((a, b) =>
				new Date(a.date) > new Date(b.date) ? -1 : 1
			);
			return filterPosts(sorted, filterParams);
		}
		// old to new
		if (sort === sortOptions[1]) {
			sorted = data.posts.sort((a, b) =>
				new Date(a.date) < new Date(b.date) ? -1 : 1
			);
			return filterPosts(sorted, filterParams);
		}
		// a-z
		if (sort === sortOptions[2]) {
			sorted = data.posts.sort((a, b) => (a.title < b.title ? -1 : 1));
			return filterPosts(sorted, filterParams);
		}
		// z-a
		if (sort === sortOptions[3]) {
			sorted = data.posts.sort((a, b) => (a.title > b.title ? -1 : 1));
			return filterPosts(sorted, filterParams);
		}

		return data.posts;
	}

	function setFilter(filter: string) {
		filterParams = filter;
		sortedPosts = sortPosts(sortBy);
	}

	function filterPosts(posts: BlogPost[], selectedTag: string): BlogPost[] {
		if (selectedTag === 'all') {
			return posts;
		}

		return posts.filter((post) => post.tags.includes(selectedTag));
	}
</script>

<div class="flex w-full flex-col justify-center space-y-10 px-6">
	<div class="self-center pb-4 text-5xl font-extrabold">all posts</div>
	<div class="flex w-1/3 flex-row justify-between self-center">
		<div class="flex">
		</div>
		<!-- <div class="flex-0 my-1 border-l border-l-darkpink/55"></div> -->
		<div>
			<div class="inline-flex justify-end space-x-2 text-xs font-medium">
				<div class="flex flex-col space-y-1">
					<div class="flex flex-row items-center justify-end space-x-1">
						<div>[</div>
						<!-- <div> -->
							<label for="sortSelect">sorting</label>

                        <div>]:</div>
							<select
								id="sortSelect"
								class="rounded-md p-px"
								bind:value={sortBy}
								on:load={() => sortPosts(sortBy)}
								on:change={() => sortPosts(sortBy)}
							>
								{#each sortOptions as option}
									<option value={option}>
										{option}
									</option>
								{/each}
							</select>
						</div>
					<!-- </div> -->

					<!-- <div class="flex flex-row items-center justify-end"> -->
					<!-- 	<div>[</div> -->
					<!-- 	<div></div> -->
					<!-- 	<div> -->
					<!-- 		<label for="filterSelect">tag: </label> -->
					<!-- 		<select -->
					<!-- 			id="filterSelect" -->
					<!-- 			class="rounded-md p-px" -->
					<!-- 			bind:value={filterParams} -->
					<!-- 			on:load={() => setFilter(filterParams)} -->
					<!-- 			on:change={() => setFilter(filterParams)} -->
					<!-- 		> -->
					<!-- 			<option value={'all'}> all posts </option> -->
					<!-- 		</select> -->
					<!-- 	</div> -->
					<!-- 	<div>]</div> -->
					<!-- </div> -->
				</div>
			</div>
		</div>
	</div>
	{#key sortedPosts[0].title}
		<PostLayout {sortedPosts} />
	{/key}
</div>
