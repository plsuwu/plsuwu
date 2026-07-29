import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
	loader: glob({ base: "./src/content", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		created_at: z.coerce.date(),
		updated_at: z.coerce.date().optional(),
		tags: z.array(z.string()),
	}),
});

export const collections = { posts };
