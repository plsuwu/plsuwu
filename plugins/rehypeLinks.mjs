import { visit } from "unist-util-visit";

/**
 * @typedef {Object} Attrs
 * @property {string | undefined} target - anchor element target name (e.g. "_blank", "_self", ...)
 * @property {string[] | undefined} rel - array of anchor element rel attributes
 * @property {string[] | undefined} classnames - array of class names to add to the anchor element
 */

/**
 * @param {Attrs} attrs - custom attributes to add to the anchor element
 */
export function rehypeLinks({ target, rel, classnames }) {
	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			if (node.tagName === "a") {
				parent.children[index] = {
					type: "element",
					tagName: "a",
					properties: {
						target: target || "_blank",
						rel: rel.join(" ") || "noopener noreferrer",
						class:
							classnames.join(" ") ||
							"text-link underline hover:brightness-35",
					},
					children: [],
				};
			}
		});
	};
}
