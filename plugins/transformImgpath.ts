// this could be reimplemented to function using unist-util-visit

import { promises as fs } from "node:fs";

async function globMarkdown() {
	const fileIterator = fs.glob("src/content/**/*.md");

	for await (const file of fileIterator) {
		try {
			const content = await fs.readFile(file, "utf-8");
			const newContent = await parseContent(file, content);
			await fs.writeFile(file, newContent);
			// await fs.copyFile(file, `${file}.backup`);
		} catch (e) {
			console.error("failed to read file:", e);
		}
	}
}

async function parseContent(filename: string, data: string) {
	const foundImgs = data
		.matchAll(/!\[\[(.*?)\]\]/g)
		.map((m) => ({
			original: m[0],
			replace: `![${m[1]!.split(".")[0]}](./assets/${filename.split(".")[0]}/${m[1]})`,
			index: m.index,
		}))
		.toArray();

	foundImgs.forEach((re) => {
		data = data.replace(re.original, re.replace);
	});

	return data;
}

await globMarkdown();
