// @ts-check

import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import { transformVideo } from "./plugins/transform-video.mjs";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
	integrations: [icon()],
	markdown: {
		processor: unified({
            rehypePlugins: [transformVideo],
			smartypants: false,
		}),
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
