import { c as create_ssr_component, b as spread, e as escape_object, d as each, v as validate_component, f as escape, g as add_attribute } from "../../../chunks/ssr.js";
const Github_logo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 256 256" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="currentColor" d="M208.31 75.68A59.78 59.78 0 0 0 202.93 28a8 8 0 0 0-6.93-4a59.75 59.75 0 0 0-48 24h-24a59.75 59.75 0 0 0-48-24a8 8 0 0 0-6.93 4a59.78 59.78 0 0 0-5.38 47.68A58.14 58.14 0 0 0 56 104v8a56.06 56.06 0 0 0 48.44 55.47A39.8 39.8 0 0 0 96 192v8H72a24 24 0 0 1-24-24a40 40 0 0 0-40-40a8 8 0 0 0 0 16a24 24 0 0 1 24 24a40 40 0 0 0 40 40h24v16a8 8 0 0 0 16 0v-40a24 24 0 0 1 48 0v40a8 8 0 0 0 16 0v-40a39.8 39.8 0 0 0-8.44-24.53A56.06 56.06 0 0 0 216 112v-8a58.14 58.14 0 0 0-7.69-28.32M200 112a40 40 0 0 1-40 40h-48a40 40 0 0 1-40-40v-8a41.74 41.74 0 0 1 6.9-22.48a8 8 0 0 0 1.1-7.69a43.81 43.81 0 0 1 .79-33.58a43.88 43.88 0 0 1 32.32 20.06a8 8 0 0 0 6.71 3.69h32.35a8 8 0 0 0 6.74-3.69a43.87 43.87 0 0 1 32.32-20.06a43.81 43.81 0 0 1 .77 33.58a8.09 8.09 0 0 0 1 7.65a41.72 41.72 0 0 1 7 22.52Z"/>`}<!-- HTML_TAG_END --></svg>`;
});
const Soundcloud_logo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 256 256" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="currentColor" d="M24 120v48a8 8 0 0 1-16 0v-48a8 8 0 0 1 16 0m24-32a8 8 0 0 0-8 8v96a8 8 0 0 0 16 0V96a8 8 0 0 0-8-8m32-8a8 8 0 0 0-8 8v104a8 8 0 0 0 16 0V88a8 8 0 0 0-8-8m32-32a8 8 0 0 0-8 8v136a8 8 0 0 0 16 0V56a8 8 0 0 0-8-8m110.84 58.34A80 80 0 0 0 144 40a8 8 0 0 0 0 16a63.76 63.76 0 0 1 63.68 57.53a8 8 0 0 0 6.44 7A32 32 0 0 1 208 184h-64a8 8 0 0 0 0 16h64a48 48 0 0 0 14.84-93.66"/>`}<!-- HTML_TAG_END --></svg>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const profiles = [
    {
      name: "hackthebox",
      profile: "https://app.hackthebox.com/profile/1555919"
    },
    {
      name: "tryhackme",
      profile: "https://tryhackme.com/p/owoplsuwu"
    },
    {
      name: "0x0539",
      profile: "https://0x0539.net/profile/pls"
    },
    {
      name: "huntress",
      profile: "https://www.huntress.com/blog/the-hackers-in-the-arena-the-huntress-ctf-retrospective"
    }
  ];
  return `<div class="mt-14 w-full flex-col lg:mt-0"><div class="w-full self-center bg-cat-mantle pb-6"><div class="text-center font-bold text-cat-text" data-svelte-h="svelte-1mm8xep"><div class="py-8 text-center text-3xl font-bold text-cat-overlay0 lg:text-3xl">about</div></div> <div class="mx-auto w-full rounded-xl bg-cat-crust text-cat-text lg:max-w-[66%]"><div class="mx-auto flex flex-col p-8 text-sm sm:text-xl lg:space-y-0"><div class="my-6 text-3xl font-semibold text-cat-overlay2 lg:my-0" data-svelte-h="svelte-155bk1p">hello,</div> <div class="text-sm lg:text-lg"><div class="mb-6"><span data-svelte-h="svelte-abzcl">this is more or less a blog or portfolio of sorts, built using</span> <ul class="my-1 list-inside indent-6 text-cat-overlay2" data-svelte-h="svelte-qdhq00"><li>[<span class="text-cat-peach">*</span>]   sveltekit (typescript),</li> <li>[<span class="text-cat-blue">*</span>]   tailwindcss, &amp;</li> <li>[<span class="text-cat-text">*</span>]   mdsvex,</li></ul>
						and then SEALED away in a docker container on google cloud.

						<div class="my-4">i currently host a small slice of writeups i have done for various challenges
							from sites &amp; competitions such as
							<span>${each(profiles, (site, idx) => {
    return `${escape(idx > 0 && idx === profiles.length - 1 ? "and " : "")} <a class="text-cat-blue underline transition-opacity duration-200 ease-out hover:opacity-50"${add_attribute("href", site.profile, 0)}> ${escape(site.name)}</a>${escape(idx < profiles.length - 1 ? ", " : ". ")}`;
  })}</span></div> <div class="mt-8">u may find this project alongside a handful of my things that i have done @
							<a class="text-cat-blue transition-all duration-200 ease-out visited:text-cat-mauve hover:opacity-50" href="https://github.com/plsuwu">${validate_component(Github_logo, "PhGithubLogo").$$render($$result, { class: "inline-flex" }, {}, {})} <span class="inline-flex underline" data-svelte-h="svelte-xe8n85">my github</span></a>
							and
							<a class="text-cat-blue transition-all duration-200 ease-out visited:text-cat-mauve hover:opacity-50" href="https://soundcloud.com/notpls">${validate_component(Soundcloud_logo, "PhSoundcloudLogo").$$render($$result, { class: "inline-flex" }, {}, {})} <span class="inline-flex underline" data-svelte-h="svelte-1a4oy88">my soundcloud</span></a></div></div></div></div></div></div></div>`;
});
export {
  Page as default
};
