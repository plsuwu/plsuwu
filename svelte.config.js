import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
// import adapter from '@sveltejs/adapter-node';
import adapter from 'svelte-adapter-bun';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte', ...mdsvexConfig.extensions],
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [mdsvex(mdsvexConfig), vitePreprocess()],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),

        // custom directory aliasing -> maybe we do `'x/*': './src/x/*' to glob the dir instead
        alias: {
            '$components': './src/lib/components',
            '$utils': './src/lib/utils',
            '$uic/*': './src/lib/components/ui/*',
        }
	}
};

export default config;
