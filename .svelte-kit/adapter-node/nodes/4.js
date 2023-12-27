

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/notes/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.nM2xStGb.js","_app/immutable/chunks/scheduler.rijuCTql.js","_app/immutable/chunks/index.7JfBVtF2.js"];
export const stylesheets = [];
export const fonts = [];
