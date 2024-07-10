import { cache } from './store';


// what the fuck
// in retrospect, i don't think this is what i want from this function
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

// normalize the scale of the matching distance - hindsight says this isn't actually doing
// anything useful
const normalized = (distance: number, sourceLen: number, targetLen: number): number => {
	const max = Math.max(sourceLen, targetLen);
	return max === 0 ? 0 : distance / max;
};

// slice our haystacks into windows size of needle.length so that we
// return more accurate results from matching algo
const getMinDistance = (needle: string, haystack: string): number => {
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

// Damerau-Levenshtein distance algorithm
const damerauLevenshtein = (source: string, target: string): number => {
	const matrix: number[][] = [];

	for (let i = 0; i <= source.length; ++i) {
		matrix[i] = [i];
	}
	for (let j = 0; j <= target.length; ++j) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= source.length; ++i) {
		for (let j = 1; j <= target.length; ++j) {
			const cost = source[i - 1] === target[j - 1] ? 0 : 1;
			matrix[i][j] = Math.min(
				matrix[i - 1][j] + 1,               // deletion
				matrix[i][j - 1] + 1,               // insertion
				matrix[i - 1][j - 1] + cost         // substitution
			);

			if (
				i > 1 &&
				j > 1 &&
				source[i - 1] === target[j - 2] &&
				source[i - 2] === target[j - 1]
			) {
				matrix[i][j] = Math.min(
					matrix[i][j],
					matrix[i - 2][j - 2] + cost     // transposition
				);
			}
		}
	}

	return matrix[source.length][target.length];
};

// search handler function
export function search(haystack: string[], needle: string): any[] {
	const maxDistance = needle.length / 2;
	const posts = haystack.map((post, idx) => ({
		postIndex: idx,
		fields: post,
	}));

	const results = posts
		.map(({ postIndex, fields }) => {
			const distance = getMinDistance(needle.toLowerCase(), fields.toLowerCase());
			const similarity = 1 - normalized(distance, needle.length, fields.length);

			return { post: cache.posts[postIndex], postIndex, distance, similarity };
		})
		.filter((res) => res.distance <= maxDistance)
		.sort((a, b) => b.similarity - a.similarity);

	return results;
}
