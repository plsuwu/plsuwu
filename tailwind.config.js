/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			screens: {
				'3xl': '1800px',
			},
			colors: {
				l: {
					darkpink: '#422571',
					pink: '#ff99be',
					lightpink: '#ffc8dd',
					whitepink: '#fff0fc',
					bgf: '#fff0ff',
				},
			},
			fontFamily: {
				sans: ['Noto Sans'],
				serif: ['Noto Serif'],
				mono: ['Noto Sans Mono'],
			},
		},

		typography: {
			DEFAULT: {
				css: {
					// everything is wrapped with <p/>, aside from <code/> which is wrapped in
					// <pre/> so we have to do some cursed stylesheet selection wrangling:

					// all <p/> elements if they are not wrapped in a <blockquote/>
					'p:not(blockquote > p):not(:has(+ blockquote))': {
						'font-family': "'Noto Sans', sans",
						'text-align': 'justify',
						margin: '1.3rem',
						'font-size': '1rem',
						'line-height': '1.25rem',
					},
					table: {
						border: '1px solid',
						'border-radius': '10px !important',
						'font-size': '1.1rem',
					},
					'th, td': {
						'border-bottom': '1px solid',
					},
					td: {
						'text-align': 'right !important',
						'font-size': '14px !important',
						'@media(min-width: 2235px)': {
							'font-size': '1rem !important',
						},
					},
					th: {
						padding: '10px',
					},
					td: {
						padding: '5px 10px',
						// 'padding': '5px',
					},
					'td > code': {
						'@media(min-width: 850px)': {
							'word-break': 'keep-all !important',
						},
					},
					table: {
						'text-align': 'left',
						border: '1px solid',
						'border-radius': '10px !important',
						width: '100%',
						'max-width': '100%',
                        'min-width': '100%',
						'@media(min-width: 850px)': {

							'max-width': 'max-content',
							'font-size': '1rem !important',
						},
						'margin-top': '1rem',
						'margin-bottom': '2rem',
					},

					// 'p:(blockquote:has(> p))': {
					//     // 'font-family': "'Noto Sans', sans-serif",
					//     margin: '0rem',
					//     padding: '0em',
					//     'font-size': '1rem',
					//     'line-height': '1.25rem',
					// },

					// reset bottom margin on <p/> elements that wrap an <img/>
					// apparently these `:has` selectors are not particularly well-supported across browsers
					// 'p:has(img) :has(button)': {
					// 	'margin-bottom': '0',
					// },

					// code block
					pre: {
						'font-size': 'smaller',
						'overflow-x': 'auto',
						'word-wrap': 'break-word',
						padding: '1em',
						display: 'flex',
						'flex-wrap': 'nowrap',
						'flex-direction': 'column',
						'align-items': 'stretch',
						'justify-content': 'center',
					},

					// inline code
					':not(pre) > code': {
						'font-family': 'monospace',
						'word-break': 'break-word',
						'border-radius': '1em',
						padding: '0 0.5em',
						'font-style': 'italic',
						'white-space': 'normal',
						color: '#884461',
						'background-color': '#f6d1e7',
						'font-weight': '550',
						'font-size': '0.9rem',
						'letter-spacing': '0px',
						'line-height': '1.2em',
					},

					// <aside/> should realistically only appear at the top of our docs
					aside: {
						color: '#451f7c',
						'text-align': 'left',
						'background-color': '#f6d1e7',
						'border-left': '4px solid #c872e8',
						padding: '1.5rem',
						'padding-left': '2rem',
						'font-size': '1rem',
						'font-weight': '400',
						'font-style': 'italic',
						margin: '2rem 0',
					},

					'blockquote': {
                        'display': 'flex',
                        'padding': '0.8em 1.5em',
						'line-height': '1rem',
                        'margin-bottom': '1em',
                        // 'margin-left': '5%',
                        'margin-right': '10%',
                        'border-radius': '10px',
						color: '#884461',
						'background-color': '#ffeeff',
						'font-style': 'italic',
					},
					// markdown that uses the `> ...` quote element are parsed to
					// <blockquote/> elements by mdsvex in our svelte markup
					'blockquote:not(:not(p + blockquote))': {
						display: 'flex',
						'margin-left': '10%',
						'margin-right': '10%',
						'@media (min-width: 640px)': {
							'margin-left': '15%',
							'margin-right': '15%',
						},
						'max-width': '100%',
						padding: '0.6em 1.5em',
						color: '#884461',
						'background-color': '#ffeeff',
						'font-style': 'italic',
						'margin-bottom': '5em',
						'border-radius': '0px 0px 10px 10px',
						'font-size': '0.85rem',
					},
                    'blockquote::before': {
						padding: '0 1.5em 0 0',
						content: "''",
						'border-left': '3px solid #d99cc1',
                    },
					// 'blockquote > p::before': {
					// 	padding: '0 1.5em 0 0',
					// 	content: "''",
					// 	'border-left': '3px solid #d99cc1',
					// },
					button: {
						width: '100%',
						display: 'flex',
						'flex-wrap': 'nowrap',
						'justify-items': 'center',
						margin: '0',
						padding: '0',
					},
					// TODO:
					// fix this general <img/> --> not quite the right selector so we're just
					// using this to clobber everything, but we want to only remove the
					// bottom margin if the following element is a blockquote (remember that
					// the <img> is wrapped in a <p> =>
					// ```
					// <p><img/><p>
					// ```)
					img: {
						padding: '0.2em',
						display: 'flex',
						'z-index': '-5',
						'justify-content': 'center',
						margin: '1rem auto',
						'margin-bottom': '0',
						border: '3px solid #d99cc1',
						'border-radius': '5px',
						// smallest
						width: '99%',
						height: '99%',
						// small non-mobile
						'@media (min-width: 640px)': {
							width: '85%',
							height: '85%',
						},
						// med non-mobile; kind of an awkward resolution
						'@media (min-width: 1024px)': {
							width: '75%',
							height: '75%',
						},
						// reg desktop
						'@media (min-width: 1280px)': {
							width: '75%',
							height: '75%',
						},
						overflow: 'visible',
					},
					ul: {
						'list-style': 'disc inside',
						'padding-left': '2rem',
						'text-align': 'left',
						'line-height': '1.75rem',
					},
					ol: {
						'list-style': 'numbers inside',
						'padding-left': '2rem',
						'text-align': 'left',
						'line-height': '1.75rem',
					},
					a: {
						'text-decoration': 'underline',
						'font-style': 'italic',
						color: '#81b6da',
						transition: 'color 300ms ease-out',
					},
					'a:hover': {
						color: '#242c50',
					},
					h1: {
						'font-family': 'Noto Sans',
						'margin-top': '3rem',
						'letter-spacing': '-3px',
						'text-align': 'left',
						'font-size': '2.75rem',
						'font-weight': '800',
						padding: '6px',
						'padding-bottom': '0px',
						'': '0px',
						'border-bottom': '4px solid #6c7086',
						'margin-bottom': '3rem',
						'max-width': 'fit-content',
						'line-height': '2.25rem',
						'@media (min-width: 1024px)': {
							'margin-bottom': '2rem',
						},
					},
					h2: {
						'font-family': 'Noto Sans',
						'font-size': '2.25em',
						'line-height': '2.25rem',
						'font-weight': '700',
						// 'font-style': 'italic',
						margin: '3rem 0 1.5rem 0',
						'letter-spacing': '-1px',
						'border-bottom': '3px solid #6c7086',
						'max-width': 'fit-content',
					},
					h3: {
						'font-family': 'Noto Sans',
						'letter-spacing': '-2px',
						'font-size': '1.95em',
						'font-weight': '700',
						'max-width': 'fit-content',
						'line-height': '2.25rem',
						margin: '3rem 0 1.5rem 0',
						'border-bottom': '1px solid #6c7086',
						opacity: '85%',
					},
					h4: {
						'font-family': 'Noto Sans',
						margin: '3rem 0 1.5rem 0',
						'font-size': '1.6em',
						'letter-spacing': '-1px',
						'font-weight': '600',
						'line-height': '2.25rem',
						'border-bottom': '1px solid #6c7086',
						'max-width': 'fit-content',
						'font-style': 'italic',
					},
					h5: {
						margin: '3rem 0 1.5rem 0',
						'font-family': 'Noto Sans',
						'font-size': '1.3em',
						'letter-spacing': '0px',
						'font-weight': '600',
						'border-bottom': '1px solid #6c7086',
						'line-height': '2.25rem',
						'max-width': 'fit-content',
						'font-style': 'italic',
					},
					h6: {
						'font-family': 'Noto Sans',
						margin: '3rem 0 1.5rem 0',
						'font-size': '1.2em',
						'font-weight': '600',
						'border-bottom': '1px solid #6c7086',
						'letter-spacing': '0px',
						'line-height': '2.25rem',
						'max-width': 'fit-content',
						'font-style': 'italic',
					},
					'h1:hover ::before': {
						content: "'#'",
						'padding-right': '7px',
						opacity: '75%',
					},
					'h2:hover ::before': {
						content: "'##'",
						'padding-right': '5px',
						opacity: '75%',
					},
					'h3:hover ::before': {
						content: "'###'",
						'padding-right': '7px',
						opacity: '75%',
					},
					'h4:hover ::before': {
						content: "'####'",
						'padding-right': '7px',
						opacity: '75%',
					},
					'h5:hover ::before': {
						content: "'#####'",
						'padding-right': '7px',
						opacity: '75%',
					},
					'h6:hover ::before': {
						content: "'######'",
						'padding-right': '7px',
						opacity: '75%',
					},
				},
			},
		},
	},

	plugins: [require('@tailwindcss/typography')],
};
