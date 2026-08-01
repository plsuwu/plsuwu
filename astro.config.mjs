// @ts-check

import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import { transformVideo } from "./plugins/transformVideo.mjs";
import remarkContents from "./plugins/remarkToc.mjs";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import node from "@astrojs/node";
import rehypeExternalLinks from "rehype-external-links";

// https://astro.build/config
export default defineConfig({
	integrations: [icon()],

	markdown: {
		processor: unified({
			remarkPlugins: [remarkContents],
			rehypePlugins: [
				transformVideo,
				[
					rehypeExternalLinks,
					{ target: "_blank", rel: ["noopener", "noreferrer"] },
				],
				rehypeSlug,
				[rehypeAutolinkHeadings, { behavior: "append" }],
			],
			smartypants: false,
		}),
	},

	vite: {
		plugins: [tailwindcss()],
	},

	adapter: node({
		mode: "standalone",
	}),
});
