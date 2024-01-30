<script lang="ts">
    import type { PageData } from "./$types";
    import PostsFromArray from "$lib/components/PostsFromArray.svelte";
    export let data: PageData;

    let recentPosts = data.posts.sort((a,b) => (new Date(a.date) > new Date(b.date) ? -1 : 1)).slice(0,3)


</script>

<div class="mt-14 w-full flex-col lg:mt-0">
    <div class="w-full self-center bg-cat-mantle pb-6">
        <div class="text-center font-bold text-cat-text">
            <div
                class="text-center text-3xl font-bold lg:text-3xl py-8"
            >
               pls's homepage
            </div>
        </div>
        <div
            class="mx-auto w-full rounded-xl bg-cat-crust text-cat-text xl:min-w-[1300px] xl:max-w-[1300px]"
        >
            <div class="p-8 italic text-cat-overlay0">
            </div>
            <div
                class="flex flex-col px-4 text-sm sm:text-lg lg:space-y-0 lg:p-8 pt-2 pb-6 xl:min-w-[1300px] xl:max-w-[1300px]"
            >
            <div class="grid grid-cols-3 text-center mb-4">
                <div>- recent posts -</div>
                <div></div>
                <div>
                <a href="/writeups" class="text-cat-blue/50 hover:text-cat-peach transition-all duration-300 italic" >view all posts {"->"}</div>
            </div>
                    <PostsFromArray sortedPosts={recentPosts} />
            </div>
        </div>
    </div>
</div>

