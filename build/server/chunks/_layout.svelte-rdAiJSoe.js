import { c as create_ssr_component, b as subscribe, v as validate_component, o as onDestroy, e as each, d as escape, f as add_attribute, i as is_promise, n as noop, m as missing_component, g as spread, h as escape_object } from './ssr-3xKC9Uba.js';
import { p as page } from './stores-z-sCXUEG.js';

const pages = [
  { name: "home", href: "/" },
  {
    name: "posts",
    children: [
      { name: "writeups", href: "/writeups" }
      // { name: "notes", href: "/notes" }, // TODO: separate 'notes' page
    ]
  },
  { name: "about", href: "/about" }
];
const Caret_up_bold = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 256 256" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="currentColor" d="M216.49 168.49a12 12 0 0 1-17 0L128 97l-71.51 71.49a12 12 0 0 1-17-17l80-80a12 12 0 0 1 17 0l80 80a12 12 0 0 1 0 17"/>`}<!-- HTML_TAG_END --></svg>`;
});
const Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let openDropdown = "";
  const handleClickOutside = (event) => {
    const path = event.composedPath();
    const isClickInside = path.some((el) => el.classList?.contains("dropdown"));
    if (!isClickInside) {
      openDropdown = "";
    }
  };
  onDestroy(() => {
    if (typeof window !== "undefined") {
      document.removeEventListener("click", handleClickOutside);
    }
  });
  return `<div class="flex flex-col bg-cat-crust p-6 shadow-lg font-bold"><div class="lg:w-1/2 lg:self-center"><ul class="flex flex-row justify-around">${each(pages, (page2) => {
    return `${"children" in page2 ? `<li class="relative"><button class="space-x-4 inline-flex group hover:text-cat-peach transition-colors duration-300 ease-out"><div class="">${escape(page2.name)}</div> <div${add_attribute("class", `${openDropdown === page2.name ? "rotate-180" : "rotate-0"} mt-0.5 inline-flex group-hover:text-cat-peach/50 text-center text-cat-overlay0 transition-transform duration-700 ease-out`, 0)}>${validate_component(Caret_up_bold, "PhCaretUpBold").$$render($$result, {}, {}, {})} </div></button> ${openDropdown === page2.name ? `<div${add_attribute(
      "class",
      `absolute bg-cat-crust min-w-[16rem] shadow-xl -ml-[4.5rem] my-3 px-6 py-4 z-10 rounded-xl border border-cat-surface0
                                ${openDropdown === page2.name ? "block" : "hidden"}`,
      0
    )}><ul class="p-4 space-y-4">${each(page2.children, (child) => {
      return `<li class="mx-auto"><a class="hover:text-cat-peach transition-colors duration-300 ease-out"${add_attribute("href", child.href, 0)}><span class="text-cat-overlay0">${escape("[*] ")}</span>   ${escape(child.name)}</a> </li>`;
    })}</ul> </div>` : ``} </li>` : `<li><a class="hover:text-cat-peach transition-colors duration-300 ease-out"${add_attribute("href", page2.href, 0)}>${escape(page2.name)}</a> </li>`}`;
  })}</ul></div></div>`;
});
const Text_indent_bold = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 256 256" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="currentColor" d="M228 128a12 12 0 0 1-12 12h-96a12 12 0 0 1 0-24h96a12 12 0 0 1 12 12M120 76h96a12 12 0 0 0 0-24h-96a12 12 0 0 0 0 24m96 104H40a12 12 0 0 0 0 24h176a12 12 0 0 0 0-24M31.51 144.49a12 12 0 0 0 17 0l40-40a12 12 0 0 0 0-17l-40-40a12 12 0 0 0-17 17L63 96l-31.49 31.51a12 12 0 0 0 0 16.98"/>`}<!-- HTML_TAG_END --></svg>`;
});
const Text_outdent_bold = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 256 256" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="currentColor" d="M228 128a12 12 0 0 1-12 12h-96a12 12 0 0 1 0-24h96a12 12 0 0 1 12 12M120 76h96a12 12 0 0 0 0-24h-96a12 12 0 0 0 0 24m96 104H40a12 12 0 0 0 0 24h176a12 12 0 0 0 0-24M72 148a12 12 0 0 0 8.49-20.49L49 96l31.49-31.52a12 12 0 0 0-17-17l-40 40a12 12 0 0 0 0 17l40 40A12 12 0 0 0 72 148"/>`}<!-- HTML_TAG_END --></svg>`;
});
const SmNav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let sidebarOpen = false;
  let openDropdown = "";
  const handleClickOutside = (event) => {
    const path = event.composedPath();
    const isClickInside = path.some((el) => el.classList?.contains("dropdown"));
    const isClickInsideSB = path.some((el) => el.classList?.contains("sidebar"));
    if (!isClickInside && openDropdown !== "") {
      openDropdown = "";
    } else if (!isClickInsideSB) {
      sidebarOpen = false;
    }
  };
  onDestroy(() => {
    if (typeof window !== "undefined") {
      document.removeEventListener("click", handleClickOutside);
    }
  });
  return `${sidebarOpen ? `<div class="w-screen"><div class="fixed min-h-screen max-h-screen bg-cat-crust/75 shadow-xl sidebar"><button class="right-0 absolute p-4 text-xl my-4 text-cat-overlay2 z-10 sidebar">${validate_component(Text_outdent_bold, "PhTextOutdentBold").$$render($$result, {}, {}, {})}</button> <div class="bg-cat-base max-h-full rounded-xl flex-row my-20 mx-4 p-6"><div class="font-bold"><ul class="text-xl space-y-6">${each(pages, (page2) => {
    return `${"children" in page2 ? `<li class="relative"><button class="space-x-24 inline-flex justify-around group hover:text-cat-peach transition-colors duration-300 ease-out"><div class="">${escape(page2.name)}</div> <div${add_attribute("class", `${openDropdown === page2.name ? "rotate-180" : "rotate-0"} mt-0.5 inline-flex group-hover:text-cat-peach/50  text-cat-overlay0 transition-transform duration-700 ease-out`, 0)}>${validate_component(Caret_up_bold, "PhCaretUpBold").$$render($$result, {}, {}, {})} </div></button> ${openDropdown === page2.name ? `<div${add_attribute(
      "class",
      `my-4 -ml-8 absolute bg-cat-crust min-w-[14rem] shadow-xl px-2 z-10 rounded-xl border border-cat-surface0
                                ${openDropdown === page2.name ? "block" : "hidden"}`,
      0
    )}><ul class="p-8 space-y-16">${each(page2.children, (child) => {
      return `<li class="mx-auto"><a class="hover:text-cat-peach transition-colors duration-300 ease-out text-base"${add_attribute("href", child.href, 0)}><span class="text-cat-overlay0">${escape("[*] ")}</span> ${escape(child.name)}</a> </li>`;
    })}</ul> </div>` : ``} </li>` : `<li><a class="hover:text-cat-peach transition-colors duration-300 ease-out"${add_attribute("href", page2.href, 0)}>${escape(page2.name)}</a> </li>`}`;
  })}</ul></div></div></div></div>` : ``} <div class="fixed p-8 pl-4 text-xl text-cat-overlay2 z-10">${!sidebarOpen ? `<button class="sidebar bg-cat-crust/50 p-1 rounded-lg">${validate_component(Text_indent_bold, "PhTextIndentBold").$$render($$result, {}, {}, {})}</button>` : ``}</div>`;
});
const footer = [
  {
    name: "github",
    placeholder: "gh",
    getIcon: () => import('./github-logo-duotone-aaciwfqK.js'),
    href: "https://github.com/plsuwu"
  }
];
async function loadIcon(getIcon) {
  const component = await getIcon();
  return component.default;
}
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<footer class="mt-6 w-full bottom-0 bg-cat-mantle/50 text-base"><div class="flex flex-row items-center justify-between"><div class="mx-12 p-2 text-xs" data-svelte-h="svelte-3ly2jt">uwu</div> <div class="inline-flex space-x-4 text-cat-subtext0 italic justify-end mx-12 p-2">${each(footer, (link) => {
    return `<ul><li class="hover:text-cat-peach transition-all duration-300 ease-in-out"><a${add_attribute("href", link.href, 0)} target="_blank">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ` <p>${escape(link.placeholder)}</p> `;
      }
      return function(IconComponent) {
        return ` ${validate_component(IconComponent || missing_component, "svelte:component").$$render($$result, {}, {}, {})} `;
      }(__value);
    }(loadIcon(link.getIcon))} </a></li> </ul>`;
  })}</div></div></footer>`;
});
function titleFromPath(path) {
  if (path.length === 2) {
    return path[1] === "" ? "plsuwu" : path[1] + " @ plsuwu";
  } else {
    return path[2] + " @ plsuwu";
  }
}
const PageHead = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let title;
  {
    if ($page) {
      title = titleFromPath($page.url.pathname.split("/"));
    }
  }
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-1d327uf_START -->${$$result.title = `<title>${escape(title)}</title>`, ""}<style data-svelte-h="svelte-9h7lim">:root {
	--ctp-latte-rosewater: #dc8a78;
	--ctp-latte-rosewater-rgb: rgb(220, 138, 120);
	--ctp-latte-rosewater-hsl: hsl(11, 59%, 67%);
	--ctp-latte-rosewater-raw: 220, 138, 120;
	--ctp-frappe-rosewater: #f2d5cf;
	--ctp-frappe-rosewater-rgb: rgb(242, 213, 207);
	--ctp-frappe-rosewater-hsl: hsl(10, 57%, 88%);
	--ctp-frappe-rosewater-raw: 242, 213, 207;
	--ctp-macchiato-rosewater: #f4dbd6;
	--ctp-macchiato-rosewater-rgb: rgb(244, 219, 214);
	--ctp-macchiato-rosewater-hsl: hsl(10, 58%, 90%);
	--ctp-macchiato-rosewater-raw: 244, 219, 214;
	--ctp-mocha-rosewater: #f5e0dc;
	--ctp-mocha-rosewater-rgb: rgb(245, 224, 220);
	--ctp-mocha-rosewater-hsl: hsl(10, 56%, 91%);
	--ctp-mocha-rosewater-raw: 245, 224, 220;
	--ctp-latte-flamingo: #dd7878;
	--ctp-latte-flamingo-rgb: rgb(221, 120, 120);
	--ctp-latte-flamingo-hsl: hsl(0, 60%, 67%);
	--ctp-latte-flamingo-raw: 221, 120, 120;
	--ctp-frappe-flamingo: #eebebe;
	--ctp-frappe-flamingo-rgb: rgb(238, 190, 190);
	--ctp-frappe-flamingo-hsl: hsl(0, 59%, 84%);
	--ctp-frappe-flamingo-raw: 238, 190, 190;
	--ctp-macchiato-flamingo: #f0c6c6;
	--ctp-macchiato-flamingo-rgb: rgb(240, 198, 198);
	--ctp-macchiato-flamingo-hsl: hsl(0, 58%, 86%);
	--ctp-macchiato-flamingo-raw: 240, 198, 198;
	--ctp-mocha-flamingo: #f2cdcd;
	--ctp-mocha-flamingo-rgb: rgb(242, 205, 205);
	--ctp-mocha-flamingo-hsl: hsl(0, 59%, 88%);
	--ctp-mocha-flamingo-raw: 242, 205, 205;
	--ctp-latte-pink: #ea76cb;
	--ctp-latte-pink-rgb: rgb(234, 118, 203);
	--ctp-latte-pink-hsl: hsl(316, 73%, 69%);
	--ctp-latte-pink-raw: 234, 118, 203;
	--ctp-frappe-pink: #f4b8e4;
	--ctp-frappe-pink-rgb: rgb(244, 184, 228);
	--ctp-frappe-pink-hsl: hsl(316, 73%, 84%);
	--ctp-frappe-pink-raw: 244, 184, 228;
	--ctp-macchiato-pink: #f5bde6;
	--ctp-macchiato-pink-rgb: rgb(245, 189, 230);
	--ctp-macchiato-pink-hsl: hsl(316, 74%, 85%);
	--ctp-macchiato-pink-raw: 245, 189, 230;
	--ctp-mocha-pink: #f5c2e7;
	--ctp-mocha-pink-rgb: rgb(245, 194, 231);
	--ctp-mocha-pink-hsl: hsl(316, 72%, 86%);
	--ctp-mocha-pink-raw: 245, 194, 231;
	--ctp-latte-mauve: #8839ef;
	--ctp-latte-mauve-rgb: rgb(136, 57, 239);
	--ctp-latte-mauve-hsl: hsl(266, 85%, 58%);
	--ctp-latte-mauve-raw: 136, 57, 239;
	--ctp-frappe-mauve: #ca9ee6;
	--ctp-frappe-mauve-rgb: rgb(202, 158, 230);
	--ctp-frappe-mauve-hsl: hsl(277, 59%, 76%);
	--ctp-frappe-mauve-raw: 202, 158, 230;
	--ctp-macchiato-mauve: #c6a0f6;
	--ctp-macchiato-mauve-rgb: rgb(198, 160, 246);
	--ctp-macchiato-mauve-hsl: hsl(267, 83%, 80%);
	--ctp-macchiato-mauve-raw: 198, 160, 246;
	--ctp-mocha-mauve: #cba6f7;
	--ctp-mocha-mauve-rgb: rgb(203, 166, 247);
	--ctp-mocha-mauve-hsl: hsl(267, 84%, 81%);
	--ctp-mocha-mauve-raw: 203, 166, 247;
	--ctp-latte-red: #d20f39;
	--ctp-latte-red-rgb: rgb(210, 15, 57);
	--ctp-latte-red-hsl: hsl(347, 87%, 44%);
	--ctp-latte-red-raw: 210, 15, 57;
	--ctp-frappe-red: #e78284;
	--ctp-frappe-red-rgb: rgb(231, 130, 132);
	--ctp-frappe-red-hsl: hsl(359, 68%, 71%);
	--ctp-frappe-red-raw: 231, 130, 132;
	--ctp-macchiato-red: #ed8796;
	--ctp-macchiato-red-rgb: rgb(237, 135, 150);
	--ctp-macchiato-red-hsl: hsl(351, 74%, 73%);
	--ctp-macchiato-red-raw: 237, 135, 150;
	--ctp-mocha-red: #f38ba8;
	--ctp-mocha-red-rgb: rgb(243, 139, 168);
	--ctp-mocha-red-hsl: hsl(343, 81%, 75%);
	--ctp-mocha-red-raw: 243, 139, 168;
	--ctp-latte-maroon: #e64553;
	--ctp-latte-maroon-rgb: rgb(230, 69, 83);
	--ctp-latte-maroon-hsl: hsl(355, 76%, 59%);
	--ctp-latte-maroon-raw: 230, 69, 83;
	--ctp-frappe-maroon: #ea999c;
	--ctp-frappe-maroon-rgb: rgb(234, 153, 156);
	--ctp-frappe-maroon-hsl: hsl(358, 66%, 76%);
	--ctp-frappe-maroon-raw: 234, 153, 156;
	--ctp-macchiato-maroon: #ee99a0;
	--ctp-macchiato-maroon-rgb: rgb(238, 153, 160);
	--ctp-macchiato-maroon-hsl: hsl(355, 71%, 77%);
	--ctp-macchiato-maroon-raw: 238, 153, 160;
	--ctp-mocha-maroon: #eba0ac;
	--ctp-mocha-maroon-rgb: rgb(235, 160, 172);
	--ctp-mocha-maroon-hsl: hsl(350, 65%, 77%);
	--ctp-mocha-maroon-raw: 235, 160, 172;
	--ctp-latte-peach: #fe640b;
	--ctp-latte-peach-rgb: rgb(254, 100, 11);
	--ctp-latte-peach-hsl: hsl(22, 99%, 52%);
	--ctp-latte-peach-raw: 254, 100, 11;
	--ctp-frappe-peach: #ef9f76;
	--ctp-frappe-peach-rgb: rgb(239, 159, 118);
	--ctp-frappe-peach-hsl: hsl(20, 79%, 70%);
	--ctp-frappe-peach-raw: 239, 159, 118;
	--ctp-macchiato-peach: #f5a97f;
	--ctp-macchiato-peach-rgb: rgb(245, 169, 127);
	--ctp-macchiato-peach-hsl: hsl(21, 86%, 73%);
	--ctp-macchiato-peach-raw: 245, 169, 127;
	--ctp-mocha-peach: #fab387;
	--ctp-mocha-peach-rgb: rgb(250, 179, 135);
	--ctp-mocha-peach-hsl: hsl(23, 92%, 75%);
	--ctp-mocha-peach-raw: 250, 179, 135;
	--ctp-latte-yellow: #df8e1d;
	--ctp-latte-yellow-rgb: rgb(223, 142, 29);
	--ctp-latte-yellow-hsl: hsl(35, 77%, 49%);
	--ctp-latte-yellow-raw: 223, 142, 29;
	--ctp-frappe-yellow: #e5c890;
	--ctp-frappe-yellow-rgb: rgb(229, 200, 144);
	--ctp-frappe-yellow-hsl: hsl(40, 62%, 73%);
	--ctp-frappe-yellow-raw: 229, 200, 144;
	--ctp-macchiato-yellow: #eed49f;
	--ctp-macchiato-yellow-rgb: rgb(238, 212, 159);
	--ctp-macchiato-yellow-hsl: hsl(40, 70%, 78%);
	--ctp-macchiato-yellow-raw: 238, 212, 159;
	--ctp-mocha-yellow: #f9e2af;
	--ctp-mocha-yellow-rgb: rgb(249, 226, 175);
	--ctp-mocha-yellow-hsl: hsl(41, 86%, 83%);
	--ctp-mocha-yellow-raw: 249, 226, 175;
	--ctp-latte-green: #40a02b;
	--ctp-latte-green-rgb: rgb(64, 160, 43);
	--ctp-latte-green-hsl: hsl(109, 58%, 40%);
	--ctp-latte-green-raw: 64, 160, 43;
	--ctp-frappe-green: #a6d189;
	--ctp-frappe-green-rgb: rgb(166, 209, 137);
	--ctp-frappe-green-hsl: hsl(96, 44%, 68%);
	--ctp-frappe-green-raw: 166, 209, 137;
	--ctp-macchiato-green: #a6da95;
	--ctp-macchiato-green-rgb: rgb(166, 218, 149);
	--ctp-macchiato-green-hsl: hsl(105, 48%, 72%);
	--ctp-macchiato-green-raw: 166, 218, 149;
	--ctp-mocha-green: #a6e3a1;
	--ctp-mocha-green-rgb: rgb(166, 227, 161);
	--ctp-mocha-green-hsl: hsl(115, 54%, 76%);
	--ctp-mocha-green-raw: 166, 227, 161;
	--ctp-latte-teal: #179299;
	--ctp-latte-teal-rgb: rgb(23, 146, 153);
	--ctp-latte-teal-hsl: hsl(183, 74%, 35%);
	--ctp-latte-teal-raw: 23, 146, 153;
	--ctp-frappe-teal: #81c8be;
	--ctp-frappe-teal-rgb: rgb(129, 200, 190);
	--ctp-frappe-teal-hsl: hsl(172, 39%, 65%);
	--ctp-frappe-teal-raw: 129, 200, 190;
	--ctp-macchiato-teal: #8bd5ca;
	--ctp-macchiato-teal-rgb: rgb(139, 213, 202);
	--ctp-macchiato-teal-hsl: hsl(171, 47%, 69%);
	--ctp-macchiato-teal-raw: 139, 213, 202;
	--ctp-mocha-teal: #94e2d5;
	--ctp-mocha-teal-rgb: rgb(148, 226, 213);
	--ctp-mocha-teal-hsl: hsl(170, 57%, 73%);
	--ctp-mocha-teal-raw: 148, 226, 213;
	--ctp-latte-sky: #04a5e5;
	--ctp-latte-sky-rgb: rgb(4, 165, 229);
	--ctp-latte-sky-hsl: hsl(197, 97%, 46%);
	--ctp-latte-sky-raw: 4, 165, 229;
	--ctp-frappe-sky: #99d1db;
	--ctp-frappe-sky-rgb: rgb(153, 209, 219);
	--ctp-frappe-sky-hsl: hsl(189, 48%, 73%);
	--ctp-frappe-sky-raw: 153, 209, 219;
	--ctp-macchiato-sky: #91d7e3;
	--ctp-macchiato-sky-rgb: rgb(145, 215, 227);
	--ctp-macchiato-sky-hsl: hsl(189, 59%, 73%);
	--ctp-macchiato-sky-raw: 145, 215, 227;
	--ctp-mocha-sky: #89dceb;
	--ctp-mocha-sky-rgb: rgb(137, 220, 235);
	--ctp-mocha-sky-hsl: hsl(189, 71%, 73%);
	--ctp-mocha-sky-raw: 137, 220, 235;
	--ctp-latte-sapphire: #209fb5;
	--ctp-latte-sapphire-rgb: rgb(32, 159, 181);
	--ctp-latte-sapphire-hsl: hsl(189, 70%, 42%);
	--ctp-latte-sapphire-raw: 32, 159, 181;
	--ctp-frappe-sapphire: #85c1dc;
	--ctp-frappe-sapphire-rgb: rgb(133, 193, 220);
	--ctp-frappe-sapphire-hsl: hsl(199, 55%, 69%);
	--ctp-frappe-sapphire-raw: 133, 193, 220;
	--ctp-macchiato-sapphire: #7dc4e4;
	--ctp-macchiato-sapphire-rgb: rgb(125, 196, 228);
	--ctp-macchiato-sapphire-hsl: hsl(199, 66%, 69%);
	--ctp-macchiato-sapphire-raw: 125, 196, 228;
	--ctp-mocha-sapphire: #74c7ec;
	--ctp-mocha-sapphire-rgb: rgb(116, 199, 236);
	--ctp-mocha-sapphire-hsl: hsl(199, 76%, 69%);
	--ctp-mocha-sapphire-raw: 116, 199, 236;
	--ctp-latte-blue: #1e66f5;
	--ctp-latte-blue-rgb: rgb(30, 102, 245);
	--ctp-latte-blue-hsl: hsl(220, 91%, 54%);
	--ctp-latte-blue-raw: 30, 102, 245;
	--ctp-frappe-blue: #8caaee;
	--ctp-frappe-blue-rgb: rgb(140, 170, 238);
	--ctp-frappe-blue-hsl: hsl(222, 74%, 74%);
	--ctp-frappe-blue-raw: 140, 170, 238;
	--ctp-macchiato-blue: #8aadf4;
	--ctp-macchiato-blue-rgb: rgb(138, 173, 244);
	--ctp-macchiato-blue-hsl: hsl(220, 83%, 75%);
	--ctp-macchiato-blue-raw: 138, 173, 244;
	--ctp-mocha-blue: #89b4fa;
	--ctp-mocha-blue-rgb: rgb(137, 180, 250);
	--ctp-mocha-blue-hsl: hsl(217, 92%, 76%);
	--ctp-mocha-blue-raw: 137, 180, 250;
	--ctp-latte-lavender: #7287fd;
	--ctp-latte-lavender-rgb: rgb(114, 135, 253);
	--ctp-latte-lavender-hsl: hsl(231, 97%, 72%);
	--ctp-latte-lavender-raw: 114, 135, 253;
	--ctp-frappe-lavender: #babbf1;
	--ctp-frappe-lavender-rgb: rgb(186, 187, 241);
	--ctp-frappe-lavender-hsl: hsl(239, 66%, 84%);
	--ctp-frappe-lavender-raw: 186, 187, 241;
	--ctp-macchiato-lavender: #b7bdf8;
	--ctp-macchiato-lavender-rgb: rgb(183, 189, 248);
	--ctp-macchiato-lavender-hsl: hsl(234, 82%, 85%);
	--ctp-macchiato-lavender-raw: 183, 189, 248;
	--ctp-mocha-lavender: #b4befe;
	--ctp-mocha-lavender-rgb: rgb(180, 190, 254);
	--ctp-mocha-lavender-hsl: hsl(232, 97%, 85%);
	--ctp-mocha-lavender-raw: 180, 190, 254;
	--ctp-latte-text: #4c4f69;
	--ctp-latte-text-rgb: rgb(76, 79, 105);
	--ctp-latte-text-hsl: hsl(234, 16%, 35%);
	--ctp-latte-text-raw: 76, 79, 105;
	--ctp-frappe-text: #c6d0f5;
	--ctp-frappe-text-rgb: rgb(198, 208, 245);
	--ctp-frappe-text-hsl: hsl(227, 70%, 87%);
	--ctp-frappe-text-raw: 198, 208, 245;
	--ctp-macchiato-text: #cad3f5;
	--ctp-macchiato-text-rgb: rgb(202, 211, 245);
	--ctp-macchiato-text-hsl: hsl(227, 68%, 88%);
	--ctp-macchiato-text-raw: 202, 211, 245;
	--ctp-mocha-text: #cdd6f4;
	--ctp-mocha-text-rgb: rgb(205, 214, 244);
	--ctp-mocha-text-hsl: hsl(226, 64%, 88%);
	--ctp-mocha-text-raw: 205, 214, 244;
	--ctp-latte-subtext1: #5c5f77;
	--ctp-latte-subtext1-rgb: rgb(92, 95, 119);
	--ctp-latte-subtext1-hsl: hsl(233, 13%, 41%);
	--ctp-latte-subtext1-raw: 92, 95, 119;
	--ctp-frappe-subtext1: #b5bfe2;
	--ctp-frappe-subtext1-rgb: rgb(181, 191, 226);
	--ctp-frappe-subtext1-hsl: hsl(227, 44%, 80%);
	--ctp-frappe-subtext1-raw: 181, 191, 226;
	--ctp-macchiato-subtext1: #b8c0e0;
	--ctp-macchiato-subtext1-rgb: rgb(184, 192, 224);
	--ctp-macchiato-subtext1-hsl: hsl(228, 39%, 80%);
	--ctp-macchiato-subtext1-raw: 184, 192, 224;
	--ctp-mocha-subtext1: #bac2de;
	--ctp-mocha-subtext1-rgb: rgb(186, 194, 222);
	--ctp-mocha-subtext1-hsl: hsl(227, 35%, 80%);
	--ctp-mocha-subtext1-raw: 186, 194, 222;
	--ctp-latte-subtext0: #6c6f85;
	--ctp-latte-subtext0-rgb: rgb(108, 111, 133);
	--ctp-latte-subtext0-hsl: hsl(233, 10%, 47%);
	--ctp-latte-subtext0-raw: 108, 111, 133;
	--ctp-frappe-subtext0: #a5adce;
	--ctp-frappe-subtext0-rgb: rgb(165, 173, 206);
	--ctp-frappe-subtext0-hsl: hsl(228, 29%, 73%);
	--ctp-frappe-subtext0-raw: 165, 173, 206;
	--ctp-macchiato-subtext0: #a5adcb;
	--ctp-macchiato-subtext0-rgb: rgb(165, 173, 203);
	--ctp-macchiato-subtext0-hsl: hsl(227, 27%, 72%);
	--ctp-macchiato-subtext0-raw: 165, 173, 203;
	--ctp-mocha-subtext0: #a6adc8;
	--ctp-mocha-subtext0-rgb: rgb(166, 173, 200);
	--ctp-mocha-subtext0-hsl: hsl(228, 24%, 72%);
	--ctp-mocha-subtext0-raw: 166, 173, 200;
	--ctp-latte-overlay2: #7c7f93;
	--ctp-latte-overlay2-rgb: rgb(124, 127, 147);
	--ctp-latte-overlay2-hsl: hsl(232, 10%, 53%);
	--ctp-latte-overlay2-raw: 124, 127, 147;
	--ctp-frappe-overlay2: #949cbb;
	--ctp-frappe-overlay2-rgb: rgb(148, 156, 187);
	--ctp-frappe-overlay2-hsl: hsl(228, 22%, 66%);
	--ctp-frappe-overlay2-raw: 148, 156, 187;
	--ctp-macchiato-overlay2: #939ab7;
	--ctp-macchiato-overlay2-rgb: rgb(147, 154, 183);
	--ctp-macchiato-overlay2-hsl: hsl(228, 20%, 65%);
	--ctp-macchiato-overlay2-raw: 147, 154, 183;
	--ctp-mocha-overlay2: #9399b2;
	--ctp-mocha-overlay2-rgb: rgb(147, 153, 178);
	--ctp-mocha-overlay2-hsl: hsl(228, 17%, 64%);
	--ctp-mocha-overlay2-raw: 147, 153, 178;
	--ctp-latte-overlay1: #8c8fa1;
	--ctp-latte-overlay1-rgb: rgb(140, 143, 161);
	--ctp-latte-overlay1-hsl: hsl(231, 10%, 59%);
	--ctp-latte-overlay1-raw: 140, 143, 161;
	--ctp-frappe-overlay1: #838ba7;
	--ctp-frappe-overlay1-rgb: rgb(131, 139, 167);
	--ctp-frappe-overlay1-hsl: hsl(227, 17%, 58%);
	--ctp-frappe-overlay1-raw: 131, 139, 167;
	--ctp-macchiato-overlay1: #8087a2;
	--ctp-macchiato-overlay1-rgb: rgb(128, 135, 162);
	--ctp-macchiato-overlay1-hsl: hsl(228, 15%, 57%);
	--ctp-macchiato-overlay1-raw: 128, 135, 162;
	--ctp-mocha-overlay1: #7f849c;
	--ctp-mocha-overlay1-rgb: rgb(127, 132, 156);
	--ctp-mocha-overlay1-hsl: hsl(230, 13%, 55%);
	--ctp-mocha-overlay1-raw: 127, 132, 156;
	--ctp-latte-overlay0: #9ca0b0;
	--ctp-latte-overlay0-rgb: rgb(156, 160, 176);
	--ctp-latte-overlay0-hsl: hsl(228, 11%, 65%);
	--ctp-latte-overlay0-raw: 156, 160, 176;
	--ctp-frappe-overlay0: #737994;
	--ctp-frappe-overlay0-rgb: rgb(115, 121, 148);
	--ctp-frappe-overlay0-hsl: hsl(229, 13%, 52%);
	--ctp-frappe-overlay0-raw: 115, 121, 148;
	--ctp-macchiato-overlay0: #6e738d;
	--ctp-macchiato-overlay0-rgb: rgb(110, 115, 141);
	--ctp-macchiato-overlay0-hsl: hsl(230, 12%, 49%);
	--ctp-macchiato-overlay0-raw: 110, 115, 141;
	--ctp-mocha-overlay0: #6c7086;
	--ctp-mocha-overlay0-rgb: rgb(108, 112, 134);
	--ctp-mocha-overlay0-hsl: hsl(231, 11%, 47%);
	--ctp-mocha-overlay0-raw: 108, 112, 134;
	--ctp-latte-surface2: #acb0be;
	--ctp-latte-surface2-rgb: rgb(172, 176, 190);
	--ctp-latte-surface2-hsl: hsl(227, 12%, 71%);
	--ctp-latte-surface2-raw: 172, 176, 190;
	--ctp-frappe-surface2: #626880;
	--ctp-frappe-surface2-rgb: rgb(98, 104, 128);
	--ctp-frappe-surface2-hsl: hsl(228, 13%, 44%);
	--ctp-frappe-surface2-raw: 98, 104, 128;
	--ctp-macchiato-surface2: #5b6078;
	--ctp-macchiato-surface2-rgb: rgb(91, 96, 120);
	--ctp-macchiato-surface2-hsl: hsl(230, 14%, 41%);
	--ctp-macchiato-surface2-raw: 91, 96, 120;
	--ctp-mocha-surface2: #585b70;
	--ctp-mocha-surface2-rgb: rgb(88, 91, 112);
	--ctp-mocha-surface2-hsl: hsl(233, 12%, 39%);
	--ctp-mocha-surface2-raw: 88, 91, 112;
	--ctp-latte-surface1: #bcc0cc;
	--ctp-latte-surface1-rgb: rgb(188, 192, 204);
	--ctp-latte-surface1-hsl: hsl(225, 14%, 77%);
	--ctp-latte-surface1-raw: 188, 192, 204;
	--ctp-frappe-surface1: #51576d;
	--ctp-frappe-surface1-rgb: rgb(81, 87, 109);
	--ctp-frappe-surface1-hsl: hsl(227, 15%, 37%);
	--ctp-frappe-surface1-raw: 81, 87, 109;
	--ctp-macchiato-surface1: #494d64;
	--ctp-macchiato-surface1-rgb: rgb(73, 77, 100);
	--ctp-macchiato-surface1-hsl: hsl(231, 16%, 34%);
	--ctp-macchiato-surface1-raw: 73, 77, 100;
	--ctp-mocha-surface1: #45475a;
	--ctp-mocha-surface1-rgb: rgb(69, 71, 90);
	--ctp-mocha-surface1-hsl: hsl(234, 13%, 31%);
	--ctp-mocha-surface1-raw: 69, 71, 90;
	--ctp-latte-surface0: #ccd0da;
	--ctp-latte-surface0-rgb: rgb(204, 208, 218);
	--ctp-latte-surface0-hsl: hsl(223, 16%, 83%);
	--ctp-latte-surface0-raw: 204, 208, 218;
	--ctp-frappe-surface0: #414559;
	--ctp-frappe-surface0-rgb: rgb(65, 69, 89);
	--ctp-frappe-surface0-hsl: hsl(230, 16%, 30%);
	--ctp-frappe-surface0-raw: 65, 69, 89;
	--ctp-macchiato-surface0: #363a4f;
	--ctp-macchiato-surface0-rgb: rgb(54, 58, 79);
	--ctp-macchiato-surface0-hsl: hsl(230, 19%, 26%);
	--ctp-macchiato-surface0-raw: 54, 58, 79;
	--ctp-mocha-surface0: #313244;
	--ctp-mocha-surface0-rgb: rgb(49, 50, 68);
	--ctp-mocha-surface0-hsl: hsl(237, 16%, 23%);
	--ctp-mocha-surface0-raw: 49, 50, 68;
	--ctp-latte-base: #eff1f5;
	--ctp-latte-base-rgb: rgb(239, 241, 245);
	--ctp-latte-base-hsl: hsl(220, 23%, 95%);
	--ctp-latte-base-raw: 239, 241, 245;
	--ctp-frappe-base: #303446;
	--ctp-frappe-base-rgb: rgb(48, 52, 70);
	--ctp-frappe-base-hsl: hsl(229, 19%, 23%);
	--ctp-frappe-base-raw: 48, 52, 70;
	--ctp-macchiato-base: #24273a;
	--ctp-macchiato-base-rgb: rgb(36, 39, 58);
	--ctp-macchiato-base-hsl: hsl(232, 23%, 18%);
	--ctp-macchiato-base-raw: 36, 39, 58;
	--ctp-mocha-base: #1e1e2e;
	--ctp-mocha-base-rgb: rgb(30, 30, 46);
	--ctp-mocha-base-hsl: hsl(240, 21%, 15%);
	--ctp-mocha-base-raw: 30, 30, 46;
	--ctp-latte-mantle: #e6e9ef;
	--ctp-latte-mantle-rgb: rgb(230, 233, 239);
	--ctp-latte-mantle-hsl: hsl(220, 22%, 92%);
	--ctp-latte-mantle-raw: 230, 233, 239;
	--ctp-frappe-mantle: #292c3c;
	--ctp-frappe-mantle-rgb: rgb(41, 44, 60);
	--ctp-frappe-mantle-hsl: hsl(231, 19%, 20%);
	--ctp-frappe-mantle-raw: 41, 44, 60;
	--ctp-macchiato-mantle: #1e2030;
	--ctp-macchiato-mantle-rgb: rgb(30, 32, 48);
	--ctp-macchiato-mantle-hsl: hsl(233, 23%, 15%);
	--ctp-macchiato-mantle-raw: 30, 32, 48;
	--ctp-mocha-mantle: #181825;
	--ctp-mocha-mantle-rgb: rgb(24, 24, 37);
	--ctp-mocha-mantle-hsl: hsl(240, 21%, 12%);
	--ctp-mocha-mantle-raw: 24, 24, 37;
	--ctp-latte-crust: #dce0e8;
	--ctp-latte-crust-rgb: rgb(220, 224, 232);
	--ctp-latte-crust-hsl: hsl(220, 21%, 89%);
	--ctp-latte-crust-raw: 220, 224, 232;
	--ctp-frappe-crust: #232634;
	--ctp-frappe-crust-rgb: rgb(35, 38, 52);
	--ctp-frappe-crust-hsl: hsl(229, 20%, 17%);
	--ctp-frappe-crust-raw: 35, 38, 52;
	--ctp-macchiato-crust: #181926;
	--ctp-macchiato-crust-rgb: rgb(24, 25, 38);
	--ctp-macchiato-crust-hsl: hsl(236, 23%, 12%);
	--ctp-macchiato-crust-raw: 24, 25, 38;
	--ctp-mocha-crust: #11111b;
	--ctp-mocha-crust-rgb: rgb(17, 17, 27);
	--ctp-mocha-crust-hsl: hsl(240, 23%, 9%);
	--ctp-mocha-crust-raw: 17, 17, 27;
}

code[class*="language-"],
pre[class*="language-"] {
	background: var(--ctp-mocha-base);
	color: var(--ctp-mocha-text);
	font-family: "Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace;
	direction: ltr;
	text-align: left;
	white-space: pre;
	word-spacing: normal;
	word-break: normal;
	line-height: 1.5;
	-moz-tab-size: 2;
	-o-tab-size: 2;
	tab-size: 2;
	-webkit-hyphens: none;
	hyphens: none;
}

/* Selection */

code[class*="language-"]::-moz-selection,
code[class*="language-"] *::-moz-selection,
pre[class*="language-"] *::-moz-selection {
	background: var(--ctp-mocha-surface1);
	color: inherit;
	text-shadow: none;
}

code[class*="language-"]::-moz-selection, code[class*="language-"] *::-moz-selection, pre[class*="language-"] *::-moz-selection {
	background: var(--ctp-mocha-surface1);
	color: inherit;
	text-shadow: none;
}

code[class*="language-"]::selection,
code[class*="language-"] *::selection,
pre[class*="language-"] *::selection {
	background: var(--ctp-mocha-surface1);
	color: inherit;
	text-shadow: none;
}

/* Code blocks */

pre[class*="language-"] {
	padding: 1.1em;
	margin: 0.25em 0;
	overflow: auto;
	border-radius: 0.3em;
}

/* Inline code */

:not(pre) > code[class*="language-"] {
	padding: 0.2em 0.3em;
	border-radius: 0.3em;
	white-space: normal;
}

/* Print */

@media print {
	code[class*="language-"],
	pre[class*="language-"] {
		text-shadow: none;
	}
}

.token.comment,
.token.prolog,
.token.cdata {
	color: var(--ctp-mocha-overlay0);
}

.token.doctype,
.token.punctuation,
.token.entity {
	color: var(--ctp-mocha-overlay2);
}

.token.attr-name,
.token.class-name,
.token.boolean,
.token.constant,
.token.number,
.token.atrule {
	color: var(--ctp-mocha-peach);
}

.token.keyword {
	color: var(--ctp-mocha-mauve);
}

.token.property,
.token.tag,
.token.symbol,
.token.deleted,
.token.important {
	color: var(--ctp-mocha-red);
}

.token.selector,
.token.string,
.token.char,
.token.builtin,
.token.inserted,
.token.regex,
.token.attr-value,
.token.attr-value > .token.punctuation {
	color: var(--ctp-mocha-green);
}

.token.variable,
.token.operator,
.token.function {
	color: var(--ctp-mocha-blue);
}

.token.url {
	color: var(--ctp-mocha-teal);
}

/* HTML overrides */

.token.attr-value > .token.punctuation.attr-equals,
.token.special-attr > .token.attr-value > .token.value.css {
	color: var(--ctp-mocha-overlay0);
}

/* CSS overrides */

.language-css .token.selector {
	color: var(--ctp-mocha-red);
}

.language-css .token.property {
	color: var(--ctp-mocha-overlay0);
}

.language-css .token.function,
.language-css .token.url > .token.function {
	color: var(--ctp-mocha-teal);
}

.language-css .token.url > .token.string.url {
	color: var(--ctp-mocha-green);
}

.language-css .token.important,
.language-css .token.atrule .token.rule {
	color: var(--ctp-mocha-mauve);
}

/* JS overrides */

.language-javascript .token.operator {
	color: var(--ctp-mocha-mauve);
}

.language-javascript .token.template-string > .token.interpolation > .token.interpolation-punctuation.punctuation {
	color: var(--ctp-mocha-red);
}

/* JSON overrides */

.language-json .token.operator {
	color: var(--ctp-mocha-overlay0);
}

.language-json .token.null.keyword {
	color: var(--ctp-mocha-peach);
}

/* MD overrides */

.language-markdown .token.url,
.language-markdown .token.url > .token.operator,
.language-markdown .token.url-reference.url > .token.string {
	color: var(--ctp-mocha-overlay0);
}

.language-markdown .token.url > .token.content {
	color: var(--ctp-mocha-blue);
}

.language-markdown .token.url > .token.url,
.language-markdown .token.url-reference.url {
	color: var(--ctp-mocha-sky);
}

.language-markdown .token.blockquote.punctuation,
.language-markdown .token.hr.punctuation {
	color: var(--ctp-mocha-surface2);
	font-style: italic;
}

.language-markdown .token.code-snippet {
	color: var(--ctp-mocha-green);
}

.language-markdown .token.bold .token.content {
	color: var(--ctp-mocha-peach);
}

.language-markdown .token.italic .token.content {
	color: var(--ctp-mocha-mauve);
}

.language-markdown .token.strike .token.content,
.language-markdown .token.strike .token.punctuation,
.language-markdown .token.list.punctuation,
.language-markdown .token.title.important > .token.punctuation {
	color: var(--ctp-mocha-red);
}

/* General */

.token.bold {
	font-weight: bold;
}

.token.comment,
.token.italic {
	font-style: italic;
}

.token.entity {
	cursor: help;
}

.token.namespace {
	opacity: 0.8;
}

/* Plugin overrides */

/* Selectors should have higher specificity than those in the plugins' default stylesheets */

/* Show Invisibles plugin overrides */

.token.token.tab:not(:empty):before,
.token.token.cr:before,
.token.token.lf:before,
.token.token.space:before {
	color: hsla(var(--ctp-mocha-overlay0-hsl), 0.15);
	text-shadow: none;
}

/* Toolbar plugin overrides */

/* Space out all buttons and move them away from the right edge of the code block */

div.code-toolbar > .toolbar.toolbar > .toolbar-item {
	margin-right: 0.4em;
}

/* Styling the buttons */

div.code-toolbar > .toolbar.toolbar > .toolbar-item > button,
div.code-toolbar > .toolbar.toolbar > .toolbar-item > a,
div.code-toolbar > .toolbar.toolbar > .toolbar-item > span {
	background: var(--ctp-mocha-base);
	color: var(--ctp-mocha-overlay0);
	padding: 0.1em 0.4em;
	border-radius: 0.3em;
}

div.code-toolbar > .toolbar.toolbar > .toolbar-item > button:hover,
div.code-toolbar > .toolbar.toolbar > .toolbar-item > button:focus,
div.code-toolbar > .toolbar.toolbar > .toolbar-item > a:hover,
div.code-toolbar > .toolbar.toolbar > .toolbar-item > a:focus,
div.code-toolbar > .toolbar.toolbar > .toolbar-item > span:hover,
div.code-toolbar > .toolbar.toolbar > .toolbar-item > span:focus {
	background: var(--ctp-mocha-base);
	color: var(--ctp-mocha-overlay0);
}

/* Line Highlight plugin overrides */

/* The highlighted line itself */

.line-highlight.line-highlight {
	background: hsla(var(--ctp-mocha-blue-hsl), 0.04);
}

/* Default line numbers in Line Highlight plugin */

.line-highlight.line-highlight:before,
.line-highlight.line-highlight[data-end]:after {
	background: var(--ctp-mocha-base);
	color: var(--ctp-mocha-overlay0);
	padding: 0.1em 0.6em;
	border-radius: 0.3em;
}

/* Hovering over a linkable line number (in the gutter area) */

/* Requires Line Numbers plugin as well */

pre[id].linkable-line-numbers.linkable-line-numbers span.line-numbers-rows > span:hover:before {
	background-color: hsla(var(--ctp-mocha-blue-hsl), 0.04);
}

/* Line Numbers and Command Line plugins overrides */

/* Line separating gutter from coding area */

.line-numbers.line-numbers .line-numbers-rows,
.command-line .command-line-prompt {
	border-right-color: hsla(220, 14%, 71%, 0.15);
}

/* Stuff in the gutter */

.line-numbers .line-numbers-rows > span:before,
.command-line .command-line-prompt > span:before {
	color: var(--ctp-mocha-surface2);
}

/* Match Braces plugin overrides */

/* Note: Outline colour is inherited from the braces */

.rainbow-braces .token.token.punctuation.brace-level-1,
.rainbow-braces .token.token.punctuation.brace-level-5,
.rainbow-braces .token.token.punctuation.brace-level-9 {
	color: var(--ctp-mocha-red);
}

.rainbow-braces .token.token.punctuation.brace-level-2,
.rainbow-braces .token.token.punctuation.brace-level-6,
.rainbow-braces .token.token.punctuation.brace-level-10 {
	color: var(--ctp-mocha-green);
}

.rainbow-braces .token.token.punctuation.brace-level-3,
.rainbow-braces .token.token.punctuation.brace-level-7,
.rainbow-braces .token.token.punctuation.brace-level-11 {
	color: var(--ctp-mocha-blue);
}

.rainbow-braces .token.token.punctuation.brace-level-4,
.rainbow-braces .token.token.punctuation.brace-level-8,
.rainbow-braces .token.token.punctuation.brace-level-12 {
	color: var(--ctp-mocha-mauve);
}

/* Diff Highlight plugin overrides */

/* Taken from https://github.com/atom/github/blob/master/styles/variables.less */

pre.diff-highlight > code .token.token.deleted:not(.prefix),
pre > code.diff-highlight .token.token.deleted:not(.prefix) {
	background-color: hsla(var(--ctp-mocha-red), 0.15);
}

pre.diff-highlight > code .token.token.deleted:not(.prefix)::-moz-selection,
pre.diff-highlight > code .token.token.deleted:not(.prefix) *::-moz-selection,
pre > code.diff-highlight .token.token.deleted:not(.prefix)::-moz-selection,
pre > code.diff-highlight .token.token.deleted:not(.prefix) *::-moz-selection {
	background-color:  hsla(var(--ctp-mocha-red),0.25);
}

pre.diff-highlight > code .token.token.deleted:not(.prefix)::-moz-selection, pre.diff-highlight > code .token.token.deleted:not(.prefix) *::-moz-selection, pre > code.diff-highlight .token.token.deleted:not(.prefix)::-moz-selection, pre > code.diff-highlight .token.token.deleted:not(.prefix) *::-moz-selection {
	background-color:  hsla(var(--ctp-mocha-red),0.25);
}

pre.diff-highlight > code .token.token.deleted:not(.prefix)::selection,
pre.diff-highlight > code .token.token.deleted:not(.prefix) *::selection,
pre > code.diff-highlight .token.token.deleted:not(.prefix)::selection,
pre > code.diff-highlight .token.token.deleted:not(.prefix) *::selection {
	background-color:  hsla(var(--ctp-mocha-red),0.25);
}

pre.diff-highlight > code .token.token.inserted:not(.prefix),
pre > code.diff-highlight .token.token.inserted:not(.prefix) {
	background-color: hsla(var(--ctp-mocha-green), 0.15);
}

pre.diff-highlight > code .token.token.inserted:not(.prefix)::-moz-selection,
pre.diff-highlight > code .token.token.inserted:not(.prefix) *::-moz-selection,
pre > code.diff-highlight .token.token.inserted:not(.prefix)::-moz-selection,
pre > code.diff-highlight .token.token.inserted:not(.prefix) *::-moz-selection {
	background-color:  hsla(var(--ctp-mocha-green),0.25);
}

pre.diff-highlight > code .token.token.inserted:not(.prefix)::-moz-selection, pre.diff-highlight > code .token.token.inserted:not(.prefix) *::-moz-selection, pre > code.diff-highlight .token.token.inserted:not(.prefix)::-moz-selection, pre > code.diff-highlight .token.token.inserted:not(.prefix) *::-moz-selection {
	background-color:  hsla(var(--ctp-mocha-green),0.25);
}

pre.diff-highlight > code .token.token.inserted:not(.prefix)::selection,
pre.diff-highlight > code .token.token.inserted:not(.prefix) *::selection,
pre > code.diff-highlight .token.token.inserted:not(.prefix)::selection,
pre > code.diff-highlight .token.token.inserted:not(.prefix) *::selection {
	background-color:  hsla(var(--ctp-mocha-green),0.25);
}

/* Previewers plugin overrides */

/* Based on https://github.com/atom-community/atom-ide-datatip/blob/master/styles/atom-ide-datatips.less and https://github.com/atom/atom/blob/master/packages/one-dark-ui */

/* Border around popup */

.prism-previewer.prism-previewer:before,
.prism-previewer-gradient.prism-previewer-gradient div {
	border-color: hsl(224, 13%, 17%);
}

/* Angle and time should remain as circles and are hence not included */

.prism-previewer-color.prism-previewer-color:before,
.prism-previewer-gradient.prism-previewer-gradient div,
.prism-previewer-easing.prism-previewer-easing:before {
	border-radius: 0.3em;
}

/* Triangles pointing to the code */

.prism-previewer.prism-previewer:after {
	border-top-color: hsl(224, 13%, 17%);
}

.prism-previewer-flipped.prism-previewer-flipped.after {
	border-bottom-color: hsl(224, 13%, 17%);
}

/* Background colour within the popup */

.prism-previewer-angle.prism-previewer-angle:before,
.prism-previewer-time.prism-previewer-time:before,
.prism-previewer-easing.prism-previewer-easing {
	background: hsl(219, 13%, 22%);
}

/* For angle, this is the positive area (eg. 90deg will display one quadrant in this colour) */

/* For time, this is the alternate colour */

.prism-previewer-angle.prism-previewer-angle circle,
.prism-previewer-time.prism-previewer-time circle {
	stroke: hsl(220, 14%, 71%);
	stroke-opacity: 1;
}

/* Stroke colours of the handle, direction point, and vector itself */

.prism-previewer-easing.prism-previewer-easing circle,
.prism-previewer-easing.prism-previewer-easing path,
.prism-previewer-easing.prism-previewer-easing line {
	stroke: hsl(220, 14%, 71%);
}

/* Fill colour of the handle */

.prism-previewer-easing.prism-previewer-easing circle {
	fill: transparent;
}
	</style><meta property="og:title"${add_attribute("content", title, 0)}><!-- HEAD_svelte-1d327uf_END -->`, ""}`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => value);
  $$unsubscribe_page();
  return `${validate_component(PageHead, "PageHead").$$render($$result, {}, {}, {})} <div class="m-0 flex min-h-screen flex-col"><div class="hidden lg:block">${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})}</div> <div class="fixed lg:hidden">${validate_component(SmNav, "SmNav").$$render($$result, {}, {}, {})}</div> <div class="my-8 w-full min-w-full flex-1 lg:my-12">${slots.default ? slots.default({}) : ``}</div> <div class="hidden lg:block">${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}</div></div>`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-rdAiJSoe.js.map
