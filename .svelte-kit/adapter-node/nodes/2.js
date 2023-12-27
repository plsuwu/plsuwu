import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.2vMHpiPP.js","_app/immutable/chunks/scheduler.rijuCTql.js","_app/immutable/chunks/index.7JfBVtF2.js","_app/immutable/chunks/each.dpA1d8OJ.js","_app/immutable/chunks/ArticleDescription.li0-ucYm.js","_app/immutable/chunks/spread.AQEXjpNi.js"];
export const stylesheets = [];
export const fonts = [];
