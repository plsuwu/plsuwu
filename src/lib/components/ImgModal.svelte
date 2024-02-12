<script lang="ts">
    import PhXCircleFill from "virtual:icons/ph/x-circle-fill";
    import { show } from "$lib/cache";
    import { fade } from "svelte/transition";

    export let src: string;

    const handleClickOff = (event: MouseEvent) => {
        const path = event.composedPath();
        const isClickInside = path.some((el) =>
            (el as HTMLElement).classList?.contains("modalImage"),
        );
        if (!isClickInside) {
            show.set(!$show);
        }
    };
</script>

<!-- <button -->
<!--     class="absolute left-[45%]" -->
<!--     on:click|stopPropagation={(e) => handleClickOff(e)}>TEST</button -->
<!-- > -->

{#key $show}
<div
in:fade={{ delay: 0, duration: 200 }}
out:fade={{ delay:0, duration:200 }}
class={`${$show ? "fixed" : "hidden"} top-0 h-full w-screen z-10 w-full flex `}>
    <div
        role={"close modal"}
        on:click|stopPropagation={(e) => handleClickOff(e)}
        class="w-[200%] fixed h-[200%] bg-[#e3eaf2] opacity-80"
    />
<div class="absolute top-0 w-full z-50 ">
        <button
            class="p-4"
            on:click|stopPropagation={(e) => handleClickOff(e)}
        >
            <PhXCircleFill class="hover:text-lightpink transition duration-300 text-lg text-black/50 w-full content-end" />
        </button>
    </div>
        <div
        class={` h-screen w-screen flex content-center size-full items-center overflow-auto`}
    >
        <img
            {src}
            alt={`modal image for ${src}`}
            class="touch-auto modalImage relative origin-left md:origin-center top-5 z-30 scale-[220%] md:mx-auto md:scale-[95%] overflow-x-scroll overflow-y-scroll m-4 rounded-lg"
        />
    </div>
</div>
{/key}
