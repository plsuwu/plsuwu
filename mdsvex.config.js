import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

const mdsvexConfig = defineConfig({
	extensions: ['.svelte.md', '.md', '.svx'],

	remarkPlugins: [remarkGfm],
	rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
});

export default mdsvexConfig;
