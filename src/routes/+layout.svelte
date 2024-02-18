<script lang="ts">
    import "../app.css";
    import { fade } from "svelte/transition";
    import Nav from "$lib/navbar/desktop/Nav.svelte";
    import SmNav from "$lib/navbar/mobile/SmNav.svelte";
    import Footer from "$lib/footer/Footer.svelte";
    import { page } from "$app/stores";
    import PageHead from "$lib/components/PageHead.svelte";

    import Yae from "$lib/banner/Yae.svelte";
    import Camila from "$lib/banner/Camila.svelte";
    import Makoto from "$lib/banner/Makoto.svelte";

    const bannerList = [Yae, Camila, Makoto];
    let randComponent = bannerList[Math.floor(Math.random() * bannerList.length)];

</script>

<PageHead />

<div class="m-0 flex min-h-screen flex-col">
    <div class="hidden sm:block w-full self-center mt-3 text-center font-bold lg:mt-5">
        <svelte:component this={randComponent} />
    </div>
    <div class="hidden sm:block">
        <Nav />
    </div>

    <div class="fixed sm:hidden">
        <SmNav />
    </div>

    {#key $page.url}
        <div
            in:fade={{ delay: 0, duration: 350 }}
            class="my-8 w-full flex-1 lg:my-12"
        >
            <slot />
        </div>
    {/key}
    <div class="hidden lg:block">
        <Footer />
    </div>
</div>
