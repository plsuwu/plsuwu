import { c as create_ssr_component, f as add_attribute, v as validate_component, d as escape, g as spread, h as escape_object } from './ssr-3xKC9Uba.js';

const Caret_double_right_bold = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 256 256" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="currentColor" d="m144.49 136.49l-80 80a12 12 0 0 1-17-17L119 128L47.51 56.49a12 12 0 0 1 17-17l80 80a12 12 0 0 1-.02 17m80-17l-80-80a12 12 0 1 0-17 17L199 128l-71.52 71.51a12 12 0 0 0 17 17l80-80a12 12 0 0 0 .01-17Z"/>`}<!-- HTML_TAG_END --></svg>`;
});
const Article = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { slug = "" } = $$props;
  const href = slug && `/writeups/${slug}`;
  if ($$props.slug === void 0 && $$bindings.slug && slug !== void 0)
    $$bindings.slug(slug);
  return `<a class="group"${add_attribute("href", href, 0)}><article class="transition-colors duration-300 ease-in-out grid grid-cols-8 hover:bg-cat-base/25 bg-cat-base rounded-xl my-2"><div class="col-span-7 p-4 ">${slots.default ? slots.default({}) : ``}</div> <div class="col-span-1 rounded-e-xl inline-grid bg-cat-base border-l border-cat-surface0 group-hover:bg-cat-peach/10 transition-color duration-300 ease-in-out"><span class="self-center items-end mx-auto text-cat-yellow group-hover:text-cat-peach transition-color duration-300 ease-in-out text-end">${validate_component(Caret_double_right_bold, "PhCaretDoubleRightBold").$$render($$result, {}, {}, {})}</span></div></article></a>`;
});
const ArticleTitle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { slug = "" } = $$props;
  let { title } = $$props;
  const id = title.toLowerCase().replace(/[^a-zA-Z ]/g, "").replace(/\s/g, "-");
  const href = slug ? `/docs/writeups/${slug}` : "#" + id;
  if ($$props.slug === void 0 && $$bindings.slug && slug !== void 0)
    $$bindings.slug(slug);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  return `<div class="mb-3 max-w-fit text-xl font-bold italic transition-colors duration-300 ease-in-out group-hover:text-cat-peach lg:text-2xl text-left"${add_attribute("id", id, 0)}><a${add_attribute("href", href, 0)}>${escape(title)}</a></div>`;
});
const ArticleMeta = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { author } = $$props;
  let { date } = $$props;
  const formattedDate = new Date(date).toDateString();
  if ($$props.author === void 0 && $$bindings.author && author !== void 0)
    $$bindings.author(author);
  if ($$props.date === void 0 && $$bindings.date && date !== void 0)
    $$bindings.date(date);
  return `<p class="space-x-2 mb-2 text-cat-overlay0 italic"><span class="">${escape(author)}</span> <span class="text-cat-text" data-svelte-h="svelte-iwripj">—</span> <span class="">${escape(formattedDate)}</span></p>`;
});
function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1).trimEnd() + "..." : str;
}
const ArticleDescription = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { description } = $$props;
  if ($$props.description === void 0 && $$bindings.description && description !== void 0)
    $$bindings.description(description);
  return `<p class="sm:p-4 p-2 pl-1 pb-0"><span class="my-1 text-cat-subtext0 italic text-start"><span class="text-lg" data-svelte-h="svelte-1c7bxco">“</span>${escape(truncate(description, 32))}<span class="text-lg" data-svelte-h="svelte-qabk7t">”</span></span></p>`;
});

export { Article as A, ArticleTitle as a, ArticleMeta as b, ArticleDescription as c };
//# sourceMappingURL=ArticleDescription-5RptBQvZ.js.map
