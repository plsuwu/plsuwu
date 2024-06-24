import type { SvelteComponent } from 'svelte';
import type { BlogPost, IconPromise } from './types';

// async network delay
export const sleep = async (ms: number) => {
	return new Promise((r) => setTimeout(r, ms));
};

export function truncate(str: string, n: number) {
	return str.length > n ? str.slice(0, n - 1).trimEnd() + '...' : str;
}

export async function iconLoader(getIcon: IconPromise): Promise<typeof SvelteComponent> {
	const component = await getIcon();
	return component.default;
}

export function fzf(query: string, data: BlogPost[]): BlogPost[] {
	query = query.toLowerCase();

	const scoreItem = (item: string): number => {
		let score = 0;
		let queryIndex = 0;
		const lowerItem = item.toLowerCase();

		for (let i = 0; i < lowerItem.length && queryIndex < query.length; i++) {
			if (lowerItem[i] === query[queryIndex]) {
				score++;
				queryIndex++;
			}
		}

		return score;
	};

	return data
		.map((item) => ({
			item,
			score: scoreItem(
				[...item.tags, item.title, item.author, item.area].join(' ')
			),
		}))
		.filter(({ score }) => score > query.length - 1)
		.map((item) => item)
		.sort((a, b) => b.score - a.score)
		.map(({ item }) => item);
}

export const slugFromPath = (path: string) =>
	path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null;

export function elapsedTime(date: number) {
	const now = new Date().getTime();
	const seconds = Math.floor((now - date) / 1000);
	const intervals = [
		{ seconds: 31536000, unit: 'year' },
		{ seconds: 2592000, unit: 'month' },
		{ seconds: 86400, unit: 'day' },
		{ seconds: 3600, unit: 'hour' },
        { seconds: 0, unit: 'seconds' }
	];

	for (let i = 0; i < intervals.length; i++) {
		const interval = intervals[i];
		const count = Math.floor(seconds / interval.seconds);
		if (count >= 1) {
			return `${count} ${interval.unit}${count === 1 ? '' : 's'} ago`;
		}
	}

	return 'just now';
}
