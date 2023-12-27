import { c as create_ssr_component, b as spread, e as escape_object, v as validate_component, m as missing_component } from "../../../../chunks/ssr.js";
const Arrow_left = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 256 256" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="currentColor" d="M224 128a8 8 0 0 1-8 8H59.31l58.35 58.34a8 8 0 0 1-11.32 11.32l-72-72a8 8 0 0 1 0-11.32l72-72a8 8 0 0 1 11.32 11.32L59.31 120H216a8 8 0 0 1 8 8"/>`}<!-- HTML_TAG_END --></svg>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let component;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  component = data.component;
  return `<div class="mt-14 lg:mt-0 w-full flex flex-col"><div class="self-center shadow-inner w-full bg-cat-mantle py-4"><div class="text-cat-text text-center font-bold"><div class="text-3xl text-center font-bold text-cat-overlay0" data-svelte-h="svelte-1t65t6f"></div> <div class="flex flex-col w-full"><div class="mx-auto text-center space-x-5"><div class="inline-flex align-middle"><a href="/writeups" class="text-xl text-cat-peach hover:opacity-50 transition-opacity duration-300 ease-in-out space-x-4">${validate_component(Arrow_left, "PhArrowLeft").$$render($$result, { class: "inline" }, {}, {})}<span class="text-cat-overlay0 font-normal underline text-base" data-svelte-h="svelte-z6x9ty">back to writeups</span></a></div> <div class="inline-flex text-cat-overlay0" data-svelte-h="svelte-1tmspa5"></div></div></div></div> <div class="mt-4 text-cat-text min-w-3xl max-w-6xl 2xl:max-w-[1920px] rounded-xl mx-auto bg-cat-crust"> <div class="text-sm p-4 lg:p-12 space-y-8 lg:mx-8 text-justify prose">${validate_component(component || missing_component, "svelte:component").$$render($$result, {}, {}, {})} ${slots.default ? slots.default({}) : ``}</div></div></div></div>`;
});
export {
  Page as default
};
