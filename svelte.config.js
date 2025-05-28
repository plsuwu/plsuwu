import mdsvexConfig from "./mdsvex.config.js";
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";

const config = {
	preprocess: [mdsvex(mdsvexConfig), vitePreprocess()],
	kit: { adapter: adapter() },
	extensions: [".svelte", ...mdsvexConfig.extensions],
};

export default config;
