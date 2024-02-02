<script lang="ts">
    import type { PageData } from "./$types";
    import type { BlogPost } from "$lib/types";
    import PostsFromArray from "$lib/components/PostsFromArray.svelte";
    import { postTags } from "$lib/cache";

    const sortOptions = ["newest first", "oldest first"];

    export let data: PageData;
    let filterParams = "all";
    let sortBy = "newest first";

    $: sortedPosts = sortPosts(sortBy);

    function sortPosts(sort: string) {
        let sorted: BlogPost[];

        if (sort === sortOptions[0]) {
            sorted = data.posts.sort((a, b) =>
                new Date(a.date) > new Date(b.date) ? -1 : 1,
            );
            return filterPosts(sorted, filterParams);
        } else {
            sorted = data.posts.sort((a, b) =>
                new Date(a.date) < new Date(b.date) ? -1 : 1,
            );
            return filterPosts(sorted, filterParams);
        }
    }

    function setFilter(filter: string) {
        console.log(filterParams, filter);
        filterParams = filter;
        sortedPosts = sortPosts(sortBy);
    }

    function filterPosts(posts: BlogPost[], selectedTag: string) {
        let filtered: any[] = [];
        if (selectedTag === "all") {
            return posts;
        }

        posts.forEach((post) => {
            if (post.tags.includes(selectedTag)) {
                if (!filtered.includes(post)) {
                    filtered.push(post);
                }
            }
        });

        if (filtered) {
            return filtered;
        } else {
            return posts;
        }
    }
</script>

<!-- TODO: all pages should use mt-14 lg:mt-0!! -->
<div class="mt-14 w-full flex-col lg:mt-0">
    <div class="w-full self-center  pb-6">
        <div class="text-center font-bold ">
            <div
                class="text-center text-3xl font-bold  lg:text-3xl py-8"
            >
                writeups
            </div>
        </div>

        <div
            class="mx-auto w-full rounded-xl xl:min-w-[1300px] xl:max-w-[1300px]"
        >
            <div class="p-8 italic "></div>
            <div
                class="flex flex-col px-4 text-sm sm:text-lg lg:space-y-0 lg:p-8 pt-2 pb-6 xl:min-w-[1300px] xl:max-w-[1300px]"
            >
                <div class="grid grid-cols-3 text-center mb-4">
                    <div>
                        <label for="sortSelect">sorting: </label>
                        <select
                            id="sortSelect"
                            class="p-2 rounded-xl "
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
                    <div></div>
                    <div>
                        <label for="filterSelect">tag: </label>
                        <select
                            id="filterSelect"
                            class="p-2 rounded-xl "
                            bind:value={filterParams}
                            on:load={() => setFilter(filterParams)}
                            on:change={() => setFilter(filterParams)}
                        >
                            <option value={"all"}> all posts </option>
                            {#each postTags as option}
                                <option value={option}>
                                    {option}
                                </option>
                            {/each}
                        </select>
                    </div>
                </div>
                {#key sortedPosts[0].title}
                    <PostsFromArray {sortedPosts} />
                {/key}
            </div>
        </div>
    </div>
</div>
