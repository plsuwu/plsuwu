// @ts-check

import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	markdown: {
		processor: unified({
			smartypants: false,
		}),
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
