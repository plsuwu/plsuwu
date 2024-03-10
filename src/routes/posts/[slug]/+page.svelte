<script lang="ts">
    import { onMount } from "svelte";
    import { imgUrlStore, show } from "$lib/cache";

    import type { PageData } from "./$types";
    import type { SvelteComponent } from "svelte";
    import PhArrowLeft from "virtual:icons/ph/arrow-left";
    import ImgModal from "$lib/components/Post/ImgModal.svelte";

    export let data: PageData;

    type C = $$Generic<typeof SvelteComponent<string, string, string>>;
    $: component = data.component as unknown as C;

    let imgs: NodeListOf<HTMLImageElement>;
    export let imageSrc = "#";

    export function toggleModal(e: Event, src: string) {
        e.stopPropagation(); // i've tried to use `stopPropagation` to stop modal scollthrough, but it doesn't work.
        imageSrc = src;
        show.set(true);
    }

    // dynamically adds an onclick listener to each image with the image's source href
    // to launch a zoomed image modal view for phone users.
    onMount(() => {
        if (typeof window !== "undefined") {
            imgs = document.querySelectorAll("img");

            imgs.forEach((img) => {
                img.addEventListener("click", (e) =>
                    toggleModal(e, img.currentSrc),
                );
            });
        }
    });

    // the builtin `scrollTo({top: 0, behavior: 'smooth'})` doesn't have the nice gradual slowdown
    // when nearing top, so we use this function to return smoothly.
    const backToTop = () => {
        const pos =
            document.documentElement.scrollTop || document.body.scrollTop;
        if (pos > 0) {
            window.requestAnimationFrame(backToTop);
            window.scrollTo(0, pos - pos / 28);
        }
    };
</script>

<ImgModal src={imageSrc} />

<div class="mt-14 lg:mt-0 w-full flex flex-col">
    <div class=" w-full py-4">
        <div class="font-bold">
            <div class="text-3xl font-bold"></div>
            <div class="flex flex-col w-full">
                <div class="text-center mx-auto space-x-5">
                    <div class="whitespace-nowrap">
                        <a
                            href="/posts"
                            class="text-base text-lightpink hover:brightness-75 transition-all italic duration-300 ease-in-out space-x-4"
                            ><PhArrowLeft class="inline" /><span
                                class="font-normal underline"
                                >back to all posts</span
                            ></a
                        >
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-4 w-full rounded-xl">
            <div class="text-sm p-4 lg:mx-20 2xl:mx-[18%] lg:p-12 prose -z-50">
                <svelte:component this={component} />
                <slot />
            </div>
        </div>
    </div>
</div>

<div class="mt-4 italic text-lightpink text-center text-sm">
    <button on:click={() => backToTop()}> back to top ^ </button>
</div>
