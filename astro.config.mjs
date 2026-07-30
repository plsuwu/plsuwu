// @ts-check

import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import { transformVideo } from "./plugins/transform-video.mjs";
import remarkTableOfContents from "./plugins/toc.mjs";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// https://astro.build/config
export default defineConfig({
	integrations: [icon()],
	markdown: {
		processor: unified({
			remarkPlugins: [remarkTableOfContents],
			rehypePlugins: [
				transformVideo,
				rehypeSlug,
				[rehypeAutolinkHeadings, { behavior: "append" }],
			],
			smartypants: false,
		}),
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
