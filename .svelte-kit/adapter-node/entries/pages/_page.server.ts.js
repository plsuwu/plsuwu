import { s as slugFromPath } from "../../chunks/slugFromPath.js";
const MAX_POSTS = 3;
const load = async () => {
  const modules = /* @__PURE__ */ Object.assign({ "/src/docs/writeups/bleed_the_stack.md": () => import("../../chunks/bleed_the_stack.js"), "/src/docs/writeups/confusing_passwords.md": () => import("../../chunks/confusing_passwords.js"), "/src/docs/writeups/cozyhosting.md": () => import("../../chunks/cozyhosting.js"), "/src/docs/writeups/mr_robot.md": () => import("../../chunks/mr_robot.js"), "/src/docs/writeups/operation_eradication.md": () => import("../../chunks/operation_eradication.js"), "/src/docs/writeups/rock_paper_psychic.md": () => import("../../chunks/rock_paper_psychic.js"), "/src/docs/writeups/speakfriend.md": () => import("../../chunks/speakfriend.js"), "/src/docs/writeups/tragedy_redux.md": () => import("../../chunks/tragedy_redux.js"), "/src/docs/writeups/writeup-test.md": () => import("../../chunks/writeup-test.js") });
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
export {
  load
};
