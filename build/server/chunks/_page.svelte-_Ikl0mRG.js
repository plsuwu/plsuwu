import { c as create_ssr_component, e as each, v as validate_component } from './ssr-3xKC9Uba.js';
import { A as Article, a as ArticleTitle, b as ArticleMeta, c as ArticleDescription } from './ArticleDescription-5RptBQvZ.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return ` <div class="mt-14 w-full flex-col lg:mt-0"><div class="w-full self-center bg-cat-mantle pb-6"><div class="text-center font-bold text-cat-text" data-svelte-h="svelte-t890vh"><div class="text-center text-3xl font-bold text-cat-overlay0 lg:text-3xl py-8">writeups</div></div> <div class="mx-auto w-full rounded-xl bg-cat-crust text-cat-text xl:min-w-[1300px] xl:max-w-[1300px]"><div class="mx-auto flex flex-col px-4 text-sm sm:text-xl lg:space-y-0 lg:p-8 2xl:grid 2xl:grid-cols-3 pt-2 pb-6 xl:min-w-[1300px] xl:max-w-[1300px]">${each(data.posts, ({ slug, title, author, description, date }) => {
    return `<div class="lg:mx-2 my-0">${validate_component(Article, "Article").$$render($$result, { slug }, {}, {
      default: () => {
        return `${validate_component(ArticleTitle, "ArticleTitle").$$render($$result, { slug, title }, {}, {})} ${validate_component(ArticleMeta, "ArticleMeta").$$render($$result, { author, date }, {}, {})} ${validate_component(ArticleDescription, "ArticleDescription").$$render($$result, { description }, {}, {})} `;
      }
    })} </div>`;
  })}</div></div></div></div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-_Ikl0mRG.js.map
