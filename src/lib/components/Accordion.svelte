<script lang="ts">
    import { slide } from "svelte/transition";
    import PhCaretUpBold from "virtual:icons/ph/caret-up-bold";
    
    /* we can pass `accordionOpen=true` as a prop to set initial state 
    to open, if desired */
    export let accordionOpen: boolean = false;

    function handleOpen() {
        accordionOpen = !accordionOpen;
    }
</script>

<div class="my-2">
    <button
        on:click={handleOpen}
        class="py-2 px-4 bg-cat-surface0 rounded-xl flex group hover:bg-cat-peach/25 hover:text-cat-peach transition-all duration-300 ease-out"
    >
        <PhCaretUpBold
            class={`${accordionOpen ? "rotate-180" : "rotate-0"} 
    mt-0.5 inline group-hover:text-cat-peach/50 text-center text-cat-overlay0 transition-all duration-500 ease-out mr-2`}
        />
        <slot name="head" />
    </button>
    {#if accordionOpen}
        <div transition:slide={{ duration: 350 }}>
            <slot name="content" />
        </div>
    {/if}
</div>
