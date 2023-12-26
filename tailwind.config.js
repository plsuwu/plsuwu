/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            fontFamily: {
                "uf-mono": ['Unifont'],
                "inter": ['Inter']
            }
        },
        typography: {
            DEFAULT: {
                css: {
                    div: {
                        "line-height": "2em"
                    },
                    p: {
                        "text-align": "left",
                        "line-height": "2em"
                    },

                    // note -- cascade order for a elem (top to bottom) -> `a:link` & `a:visted` > `a:hover` > `a:active`
                    a: {
                        color: "#89b4fa",
                        "text-decoration-line": "underline",
                        "transition": "opacity 200ms ease-out"
                    },
                    "a:visited": {
                        color: "#cba6f7",
                    },
                    "a:hover": {
                        opacity: "0.5"
                    },

                    // <aside/>s can be used as a headline subtext item;
                    // <blockquote/>s can be for like, an inline comment.
                    aside: {
                        color: "#cdd6f4",
                        "background-color": "#1e1e2e",
                        "border-left": "4px solid #fab387",
                        "padding": "0.5rem",
                        "padding-left": "1rem",
                        'font-style': 'italic',
                    },
                    blockquote: {
                        color: "#9399b2",
                        "background-color": "#1e1e2e",
                        "border-left": "4px solid #9399b2",
                        "padding": "0.25rem",
                        "padding-left": "0.5rem",
                        'font-style': 'italic',
                    },

                    code: {
                        "background-color": "#1e1e2e",
                        "padding": "4px",
                        "border-radius": "10px",
                        "font-size": "0.75rem",
                        "line-height": "1rem",
                        '@media (min-width: 1024px)': {
                            "font-size": "0.875rem",
                            "line-height": "1.25rem"
                        },
                    },
                    ul: {
                        "list-style": "disc inside",
                        "padding-left": "2rem",
                        "text-align": "left",
                    },
                    h1: {
                        "margin": "auto",
                        "text-align": "center",
                        "font-size": "2.5em",
                        "font-weight": "900",
                        "padding": "6px",
                        "padding-bottom": "8px",
                        "border-bottom": "4px solid #bac2de",
                        "margin-bottom": "4rem",
                        "max-width": "fit-content"
                    },
                    h2: {
                        "font-size": "1.75em",
                        "font-weight": "800",
                        //"padding-bottom": "4px",
                        "border-bottom": "3px solid #6c7086",
                        "max-width": "fit-content"

                    },
                    h3: {
                        "font-size": "1.5em",
                        "font-weight": "700",
                        "border-bottom": "2.5px solid #6c7086",
                        "max-width": "fit-content"
                    },
                    h4: {
                        "font-size": "1.4em",
                        "font-weight": "700",
                        "color": "#6c7086",
                        "border-bottom": "1px solid #313244",
                        "max-width": "fit-content"
                    },
                    h5: {
                        "font-size": "1.3em",
                        "font-weight": "600",
                        "color": "#6c7086"
                    },
                    h6: {
                        "font-size": "1.25em",
                        "font-weight": "600",
                        "color": "#6c7086",
                        "font-style": "italic"
                    }


                }
            }
        }
    },
    plugins: [
        require("@catppuccin/tailwindcss")({
            prefix: "cat",
            defaultFlavour: "mocha"
        }),
        require("@tailwindcss/typography")
    ],
}

/* mocha scheme: */
// $rosewater: #f5e0dc;
// $flamingo: #f2cdcd;
// $pink: #f5c2e7;
// $mauve: #cba6f7;
// $red: #f38ba8;
// $maroon: #eba0ac;
// $peach: #fab387;
// $yellow: #f9e2af;
// $green: #a6e3a1;
// $teal: #94e2d5;
// $sky: #89dceb;
// $sapphire: #74c7ec;
// $blue: #89b4fa;
// $lavender: #b4befe;
// $text: #cdd6f4;
// $subtext1: #bac2de;
// $subtext0: #a6adc8;
// $overlay2: #9399b2;
// $overlay1: #7f849c;
// $overlay0: #6c7086;
// $surface2: #585b70;
// $surface1: #45475a;
// $surface0: #313244;
// $base: #1e1e2e;
// $mantle: #181825;
// $crust: #11111b;
