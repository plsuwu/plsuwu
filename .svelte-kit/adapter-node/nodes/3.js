

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.3Q0zpSEz.js","_app/immutable/chunks/scheduler.rijuCTql.js","_app/immutable/chunks/index.7JfBVtF2.js","_app/immutable/chunks/each.dpA1d8OJ.js","_app/immutable/chunks/spread.AQEXjpNi.js"];
export const stylesheets = [];
export const fonts = [];
