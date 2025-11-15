import {
	pgTable as T,
	pgEnum,
	serial,
	integer,
	timestamp,
	text
} from "drizzle-orm/pg-core";
import { DEFAULT_CREATOR } from "terminal/fs.svelte";

export const postTypeEnum = pgEnum("post_type", ["ctf", "note", "misc"]);

export const posts = T("posts", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	author: text("author").default(DEFAULT_CREATOR).notNull(),

	type: postTypeEnum("type").notNull(),
	tags: text("tags").array().notNull(),

	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
