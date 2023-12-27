import { s as slugFromPath } from './slugFromPath-TkjAgDnQ.js';
import { e as error } from './index-q5FEf9Bi.js';

const load = async ({ params }) => {
  const modules = /* @__PURE__ */ Object.assign({ "/src/docs/writeups/bleed_the_stack.md": () => import('./bleed_the_stack-PNQK_Bcu.js'), "/src/docs/writeups/confusing_passwords.md": () => import('./confusing_passwords-KUA4Cyro.js'), "/src/docs/writeups/cozyhosting.md": () => import('./cozyhosting-_3rjHR5d.js'), "/src/docs/writeups/mr_robot.md": () => import('./mr_robot-ndUnsN8X.js'), "/src/docs/writeups/operation_eradication.md": () => import('./operation_eradication-6Y_VRygr.js'), "/src/docs/writeups/rock_paper_psychic.md": () => import('./rock_paper_psychic-FedB4acR.js'), "/src/docs/writeups/speakfriend.md": () => import('./speakfriend-hRuEXMh9.js'), "/src/docs/writeups/tragedy_redux.md": () => import('./tragedy_redux-Mm9d4yGI.js'), "/src/docs/writeups/writeup-test.md": () => import('./writeup-test-Ebz-xL8G.js') });
  let match = {};
  for (const [path, resolver] of Object.entries(modules)) {
    if (slugFromPath(path) === params.slug) {
      match = { path, resolver };
      break;
    }
  }
  const post = await match?.resolver?.();
  if (!post || !post.metadata.published) {
    error(404);
  }
  return {
    component: post.default,
    frontmatter: post.metadata
  };
};

var _page_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-1Zo6_Mlz.js')).default;
const universal_id = "src/routes/writeups/[slug]/+page.ts";
const imports = ["_app/immutable/nodes/6.5Jz0LHrY.js","_app/immutable/chunks/preload-helper.0HuHagjb.js","_app/immutable/chunks/control.pJ1mnnAb.js","_app/immutable/chunks/scheduler.rijuCTql.js","_app/immutable/chunks/index.7JfBVtF2.js","_app/immutable/chunks/spread.AQEXjpNi.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=6-vDt8VyCx.js.map
