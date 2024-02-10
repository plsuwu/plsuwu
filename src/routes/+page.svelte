<script lang="ts">
    import type { PageData } from "./$types";
    import type { BlogPost } from "$lib/types";
    import PostsFromArray from "$lib/components/PostsFromArray.svelte";
    import { onMount } from "svelte";
    export let data: PageData;

    let recentPosts: BlogPost[] = data.posts;

    if (data.posts) {
        recentPosts = data.posts
            .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
            .slice(0, 5);
    }
</script>

<div class="mx-auto w-full rounded-xl xl:min-w-[1300px] xl:max-w-[1300px]">
    <div
        class="mt-14 mb-6 text-center underline tracking-[-3px] p-2 italic font-bold text-4xl rounded-lg"
    >
        - pls's blog -
    </div>
    <div
        class="p-4 border rounded-lg  flex flex-col px-4 text-xs sm:text-lg lg:space-y-0 lg:p-8 pt-2 pb-6 xl:min-w-[1300px] xl:max-w-[1300px]"
    >
        <div class="grid grid-cols-3 text-center mb-4 ">
            <div>-- recent posts --</div>
            <div></div>
            <div>
                <a
                    href="/writeups"
                    class="whitespace-nowrap hover:brightness-75 text-lightpink transition-all duration-300 italic"
                >
                    - view all posts {"->"}</a
                >
            </div>
        </div>
        <PostsFromArray sortedPosts={recentPosts} />
        <div class="text-center pt-8">
            <a
                href="/writeups"
                class="whitespace-nowrap hover:brightness-75 text-lightpink transition-all duration-300 italic"
            >
                - view all posts {"->"}</a
            >
        </div>
    </div>
</div>
