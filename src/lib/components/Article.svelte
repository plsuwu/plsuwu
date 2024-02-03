<script lang="ts">
    export let slug = "";
    const href = slug && `/writeups/${slug}`;
    import PhCaretDoubleRightBold from "virtual:icons/ph/caret-double-right-bold";
</script>

<a class="group items-center min-w-full flex flex-col p-3" {href}>
    <article
        class="transition-all min-w-[75%] items-center group-hover:scale-110 group-hover:shadow-md rounded-lg duration-500 ease-in-out  my-2"
    >
        <div class=" items-center p-4 ">
            <slot />
        </div>


    </article>
</a>
<div class="border border-b"></div>
