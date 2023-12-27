import * as server from '../entries/pages/writeups/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/writeups/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/writeups/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.sFss7hC8.js","_app/immutable/chunks/scheduler.rijuCTql.js","_app/immutable/chunks/index.7JfBVtF2.js","_app/immutable/chunks/each.dpA1d8OJ.js","_app/immutable/chunks/ArticleDescription.li0-ucYm.js","_app/immutable/chunks/spread.AQEXjpNi.js"];
export const stylesheets = [];
export const fonts = [];
