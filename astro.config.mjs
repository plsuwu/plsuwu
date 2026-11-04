// @ts-check

import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import { transformVideo } from "./plugins/transformVideo.mjs";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import remarkContents from "./plugins/remarkToc.mjs";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import rehypeSlug from "rehype-slug";
import svelte from "@astrojs/svelte";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
    integrations: [icon(), mdx(), svelte()],
    output: "static",
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
});
