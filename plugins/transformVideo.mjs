import { visit } from "unist-util-visit";

export function transformVideo() {
	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			if (
				node.tagName === "img" &&
				/\.(mp4|webm)$/i.test(node.properties.src)
			) {
				parent.children[index] = {
					type: "element",
					tagName: "video",
					properties: {
						src: node.properties.src,
						controls: true,
						preload: "metadata",
					},
					children: [],
				};
			}
		});
	};
}
