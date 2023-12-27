

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.v0hGXTHF.js","_app/immutable/chunks/scheduler.rijuCTql.js","_app/immutable/chunks/index.7JfBVtF2.js","_app/immutable/chunks/stores.XxiaQcc7.js","_app/immutable/chunks/singletons.VeivIebh.js"];
export const stylesheets = [];
export const fonts = [];
