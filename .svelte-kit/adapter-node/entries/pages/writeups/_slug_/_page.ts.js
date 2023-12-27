import { s as slugFromPath } from "../../../../chunks/slugFromPath.js";
import { e as error } from "../../../../chunks/index.js";
const load = async ({ params }) => {
  const modules = /* @__PURE__ */ Object.assign({ "/src/docs/writeups/bleed_the_stack.md": () => import("../../../../chunks/bleed_the_stack.js"), "/src/docs/writeups/confusing_passwords.md": () => import("../../../../chunks/confusing_passwords.js"), "/src/docs/writeups/cozyhosting.md": () => import("../../../../chunks/cozyhosting.js"), "/src/docs/writeups/mr_robot.md": () => import("../../../../chunks/mr_robot.js"), "/src/docs/writeups/operation_eradication.md": () => import("../../../../chunks/operation_eradication.js"), "/src/docs/writeups/rock_paper_psychic.md": () => import("../../../../chunks/rock_paper_psychic.js"), "/src/docs/writeups/speakfriend.md": () => import("../../../../chunks/speakfriend.js"), "/src/docs/writeups/tragedy_redux.md": () => import("../../../../chunks/tragedy_redux.js"), "/src/docs/writeups/writeup-test.md": () => import("../../../../chunks/writeup-test.js") });
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
export {
  load
};
