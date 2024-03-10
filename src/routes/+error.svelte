<script lang="ts">
    import { page } from "$app/stores";
</script>

<div class="w-full flex flex-col mx-auto my-20">
    <div class="text-center">
        {#if $page.status === 500}
            <div
                class={`my-10 italic text-xl text-lightpink transition-all duration-1000`}
            >
                server undergoing maintenance - please try again later.
            </div>
        {:else}
            <div class={`text-cat-red text-3xl font-bold`}>
                your request returned an error.
            </div>
            <div class={`text-black transition-all duration-1000`}>
                responded with status '{$page.status}' ({$page.error?.message.toLowerCase()})
            </div>
        {/if}
    </div>
</div>
<div class="w-full flex flex-col text-center mx-auto my-20">
    <a
        class="group hover:brightness-50 text-lightpink transition-all duration-300 ease-out"
        href="/"
    >
        {#if $page.status !== 500}
            {"<--"} return to homepage
        {/if}
    </a>
</div>
