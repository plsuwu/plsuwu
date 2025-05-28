import type { Post } from "$lib/content/import.svelte";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export class FormatDate {
	static fmt(date: Date) {
		return dayjs(date).format("ll");
	}

	static timeAgo(date: Date) {
		return dayjs(date).fromNow();
	}
}

export class FormatPostLayout {
	static rows(posts: Post[], rows: number = 3) {
		return Math.ceil(posts.length / rows);
	}
}

export class FormatPostMeta {
	static truncate(str: string, maxChars: number = 128) {
		if (str.length > maxChars) {
			let trunc = str.slice(0, maxChars) + "...";

			return trunc;
		}

		return str;
	}
}
