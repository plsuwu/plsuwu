<script lang="ts">
    import Accordion from "$lib/components/Accordion.svelte";

    import PhGithubLogo from "virtual:icons/ph/github-logo";
    import PhSoundcloudLogo from "virtual:icons/ph/soundcloud-logo";

    interface Profile {
        name: string;
        profile: string;
    }

    const profiles: Profile[] = [
        {
            name: "hackthebox",
            profile: "https://app.hackthebox.com/profile/1555919",
        },
        {
            name: "tryhackme",
            profile: "https://tryhackme.com/p/owoplsuwu",
        },
        {
            name: "0x0539",
            profile: "https://0x0539.net/profile/pls",
        },
        {
            name: "huntress",
            profile:
                "https://www.huntress.com/blog/the-hackers-in-the-arena-the-huntress-ctf-retrospective",
        },
    ];
</script>

<div class="mt-14 w-full flex-col lg:mt-0">
    <div class="w-full self-center bg-cat-mantle pb-6">
        <div class="text-center font-bold text-cat-text">
            <div
                class="py-8 text-center text-3xl font-bold text-cat-overlay0 lg:text-3xl"
            >
                about
            </div>
        </div>
        <div
            class="mx-auto w-full rounded-xl bg-cat-crust text-cat-text lg:max-w-[66%] text-center py-24"
        >

        <div class="mb-4">
            cybersecurity vagueposts.
        </div>

        <div class="mb-8 italic text-cat-overlay0">
            (sorry about the ui)
        </div>
        <div>
        <span>
            <a
                class="text-cat-blue transition-all duration-200 ease-out visited:text-cat-mauve hover:opacity-50"
                href="https://github.com/plsuwu"
            >
                <PhGithubLogo class="inline-flex" />
                <span class="inline-flex underline">github.com/plsuwu</span>
            </a>
            </div>
        </div>
    </div>
</div>
