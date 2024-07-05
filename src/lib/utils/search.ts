import type { Post } from './postLoader';
import { cache } from './store';

interface MatchedResult {
	item: string;
	distance: number;
}

const damerauLevenshtein = (source: string, target: string): number => {
	const sourceLen = source.length;
	const targetLen = target.length;

	if (sourceLen === 0) return targetLen;
	if (targetLen === 0) return sourceLen;

	const matrix: number[][] = [];

	for (let i = 0; i <= sourceLen; ++i) {
		matrix[i] = [i];
	}
	for (let j = 0; j <= targetLen; ++j) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= sourceLen; ++i) {
		for (let j = 1; j <= targetLen; ++j) {
			const cost = source[i - 1] === target[j - 1] ? 0 : 1;

			matrix[i][j] = Math.min(
				matrix[i - 1][j] + 1, // del
				matrix[i][j - 1] + 1, // ins
				matrix[i - 1][j - 1] + cost // sub
			);

			if (
				i > 1 &&
				j > 1 &&
				source[i - 1] === target[j - 2] &&
				source[i - 2] === target[j - 1]
			) {
				matrix[i][j] = Math.min(
					matrix[i][j],
					matrix[i - 2][j - 2] + cost // trans
				);
			}
		}
	}

	// console.log(matrix);
	return matrix[sourceLen][targetLen];
};

const normalized = (distance: number, sourceLen: number, targetLen: number): number => {
	const max = Math.max(sourceLen, targetLen);
	return max === 0 ? 0 : distance / max;
};

const getMinDistance = (needle: string, haystack: string): number => {
	// base case:
    // if search term is longer than the current post string,
    // simply run the search.
	if (needle.length > haystack.length) {
		return damerauLevenshtein(needle, haystack);
	}

	let minDistance = Infinity;
	for (let i = 0; i <= haystack.length; ++i) {
		const substr = haystack.slice(i, i + needle.length);
		const distance = damerauLevenshtein(needle, substr);

		minDistance = Math.min(minDistance, distance);
	}

	return minDistance;
};

export function runSearch(haystack: string[], needle: string): any[] {
	const maxDistance = needle.length;

	const posts = haystack.map((post, idx) => ({
		postIndex: idx,
		fields: post,
	}));
	const results = posts
		.map(({ postIndex, fields }) => {
			const distance = getMinDistance(needle.toLowerCase(), fields.toLowerCase());
			const similarity = 1 - normalized(distance, needle.length, fields.length);
			return { posts: cache.posts[postIndex], distance, similarity };
		})
		.filter((res) => res.distance <= maxDistance)
		.sort((a, b) => b.similarity - a.similarity);

    return results;
}

// what the fuck
export function debounce<T extends (...args: any[]) => void>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout>;

	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		const context = this;

		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(context, args), wait);
	};
}
