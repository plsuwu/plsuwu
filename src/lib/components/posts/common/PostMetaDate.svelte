<script lang="ts">
	import PostMetaTags from './PostMetaTags.svelte';

	export let type: string;
	export let tags: string[];
	export let date: string;
	const formatted = new Date(date).toLocaleDateString();

	// pull this out into a util if you find it being reused
	export function elapsedTime(date: number) {
		const now = new Date().getTime();
		const seconds = Math.floor((now - date) / 1000);
		const intervals = [
			{ seconds: 31536000, unit: 'year' },
			{ seconds: 2592000, unit: 'month' },
			{ seconds: 86400, unit: 'day' },
			{ seconds: 3600, unit: 'hour' },
			{ seconds: 0, unit: 'seconds' },
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
</script>

<div class="mb-2 flex w-full flex-col justify-end">
	<div class="flex flex-row justify-end space-x-2">
		<div class="font-medium italic"></div>
		<div></div>
		<PostMetaTags {tags} {type} />
	</div>
	<div class="flex flex-row justify-end italic">
		posted:&nbsp;<span class="opacity-55"
			>{elapsedTime(new Date(date).getTime())}
			<span class="opacity-45">({formatted})</span>
		</span>
	</div>
</div>
