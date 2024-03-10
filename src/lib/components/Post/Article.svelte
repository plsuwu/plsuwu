<script lang="ts">
    export let slug = "";
    const href = slug && `/posts/${slug}`;
    // import PhCaretDoubleRightBold from "virtual:icons/ph/caret-double-right-bold";
</script>

<a class="group items-start min-w-full flex flex-col p-3" {href}>
    <div class="w-full sm:w-4/5 self-center">
        <article
            class="transition-all min-w-full self-center items-center group-hover:scale-110 group-hover:shadow-md rounded-lg duration-500 ease-in-out my-2"
        >
            <div class="p-2">
                <slot />
            </div>
        </article>
    </div>
</a>
<div class="border border-b"></div>
