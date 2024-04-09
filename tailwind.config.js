/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				l: {
					darkpink: '#210811',
					pink: '#ff99be',
					lightpink: '#ffc8dd',
					darkblue: '#001529',
					blue: '#85c4ff',
					lightblue: '#bde0fe',
					whitepink: '#fff0fc',
					whiteblue: '#f2f8ff',
				},
			},
            fontFamily: {
                sans: ['Noto Sans'],
                mono: ['Noto Sans Mono'],
            }
		},
	},
	plugins: [],
};
