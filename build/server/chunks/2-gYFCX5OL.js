import { s as slugFromPath } from './slugFromPath-TkjAgDnQ.js';

const MAX_POSTS = 3;
const load = async () => {
  const modules = /* @__PURE__ */ Object.assign({ "/src/docs/writeups/bleed_the_stack.md": () => import('./bleed_the_stack-PNQK_Bcu.js'), "/src/docs/writeups/confusing_passwords.md": () => import('./confusing_passwords-KUA4Cyro.js'), "/src/docs/writeups/cozyhosting.md": () => import('./cozyhosting-_3rjHR5d.js'), "/src/docs/writeups/mr_robot.md": () => import('./mr_robot-ndUnsN8X.js'), "/src/docs/writeups/operation_eradication.md": () => import('./operation_eradication-6Y_VRygr.js'), "/src/docs/writeups/rock_paper_psychic.md": () => import('./rock_paper_psychic-FedB4acR.js'), "/src/docs/writeups/speakfriend.md": () => import('./speakfriend-hRuEXMh9.js'), "/src/docs/writeups/tragedy_redux.md": () => import('./tragedy_redux-Mm9d4yGI.js'), "/src/docs/writeups/writeup-test.md": () => import('./writeup-test-Ebz-xL8G.js') });
  const postPromises = Object.entries(modules).map(
    ([path, resolver]) => resolver().then(
      (post2) => ({
        slug: slugFromPath(path),
        ...post2.metadata
      })
    )
  );
  const post = await Promise.all(postPromises);
  post.sort((a, b) => new Date(a.date) > new Date(b.date) ? -1 : 1);
  const publishedPost = post.filter((post2) => post2.published).slice(0, MAX_POSTS);
  return { posts: publishedPost };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-FaDo6gLd.js')).default;
const server_id = "src/routes/+page.server.ts";
const imports = ["_app/immutable/nodes/2.2vMHpiPP.js","_app/immutable/chunks/scheduler.rijuCTql.js","_app/immutable/chunks/index.7JfBVtF2.js","_app/immutable/chunks/each.dpA1d8OJ.js","_app/immutable/chunks/ArticleDescription.li0-ucYm.js","_app/immutable/chunks/spread.AQEXjpNi.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-gYFCX5OL.js.map
