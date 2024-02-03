<script lang="ts">
    import type { PageData } from "./$types";
    import type { SvelteComponent } from "svelte";
    import PhArrowLeft from "virtual:icons/ph/arrow-left";

    export let data: PageData;

    type C = $$Generic<typeof SvelteComponent<string, string, string>>;
    $: component = data.component as unknown as C;

    // the builtin `scrollTo({top: 0, behavior: 'smooth'})` doesn't have the nice gradual slowdown
    // when nearing top, so we use this function instead.
    const backToTop = () => {
        const c = document.documentElement.scrollTop || document.body.scrollTop;
        if (c > 0) {
            window.requestAnimationFrame(backToTop);
            window.scrollTo(16, c - c / 32);
        }
    };

</script>

<div class="mt-14 lg:mt-0 w-full flex flex-col">
    <div class=" w-full py-4">
        <div class="font-bold">
            <div class="text-3xl font-bold"></div>
            <div class="flex flex-col w-full">
                <div class="text-start mx-32 space-x-5">
                    <div class="">
                        <a
                            href="/writeups"
                            class="text-sm sm:text-base text-lightpink hover:brightness-75 transition-all italic duration-300 ease-in-out space-x-4"
                            ><PhArrowLeft class="inline" /><span
                                class="font-normal underline"
                                >back to writeups</span
                            ></a
                        >
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-4 max-w-[1920px] rounded-xl mx-auto">
            <!-- todo: need to triple check custom prose style -->
            <div class="text-sm p-4 p-12 mx-8 prose">
                <svelte:component this={component} />
                <slot />
            </div>
        </div>
    </div>
</div>

<div class="mt-4 italic text-lightpink text-center text-sm">
    <button on:click={() => backToTop()}>
        back to top ^
    </button>
</div>
