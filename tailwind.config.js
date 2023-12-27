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
                    "p:not(:last-child)": {
                        "text-align": "left",
                        "margin": "0.25rem 1rem",
                        "margin-top": "2rem",
                        "font-size": "1rem",
                        "line-height": "1.75rem",
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

                    // <aside/> is used as a 'side comment';
                    // <blockquote/> is used to caption e.g an image.
                    aside: {
                        color: "#cdd6f4",
                        "text-align": "left",
                        "background-color": "#1e1e2e",
                        "border-left": "4px solid #fab387",
                        "padding": "1.5rem",
                        "padding-left": "2rem",
                        "font-size": "1.1rem",
                        "font-weight": "600"
                        //'font-style': 'italic',
                    },
                    "blockquote p:last-child": {
                        "text-align": "left",
                        "padding": "4px",
                        "padding-left": "1.5rem",
                        "margin-bottom": "2rem",
                        color: "#9399b2",
                        "background-color": "#1e1e2e",
                        "border-left": "4px solid #9399b2",
                        'font-style': 'italic',
                    },
                    "code": {
                        "background-color": "#1e1e2e",
                        "padding": "4px",
                        "border-radius": "10px",
                        "font-size": "0.75rem",
                        "line-height": "1rem",
                        '@media (min-width: 1024px)': {
                            "font-size": "0.875rem",
                            "line-height": "1.25rem",
                        },
                    },
                    ul: {
                        "list-style": "disc inside",
                        "padding-left": "2rem",
                        "text-align": "left",
                        "line-height": "1.75rem"
                    },
                    ol: {
                        "list-style": "numbers inside",
                        "padding-left": "2rem",
                        "text-align": "left",
                        "line-height": "1.75rem"

                    },
                    h1: {
                        "margin": "1rem auto",
                        "text-align": "left",
                        "font-size": "3rem",
                        "font-weight": "900",
                        "padding": "6px",
                        "padding-bottom": "0px",
                        "border-bottom": "4px solid #6c7086",
                        "margin-bottom": "3rem",
                        //"max-width": "fit-content",
                        "line-height": "2.25rem",
                        '@media (min-width: 1024px)': {
                            "margin-bottom": "5rem"
                        },
                    },
                    h2: {
                        "font-size": "1.75em",
                        "font-weight": "800",
                        "margin": "2rem 0",
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
