import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import remarkGfm from 'remark-gfm';

const mdsvexConfig = defineConfig({
    extensions: ['.svelte.md', '.md', '.svx'],

    remarkPlugins: [remarkGfm],
    rehypePlugins: []

});

export default mdsvexConfig;
