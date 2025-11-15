<script lang="ts">
	import { DateTime } from "luxon";
	import type { ChildItem } from "terminal/fs";

	interface FormattedChildItem extends ChildItem {
		m: string;
		d: number;
		th: string | number;
	}

	let { items }: { items: ChildItem[] } = $props();
	let formattedItems = $derived(
		items.map((item) => ({
			...formatTimeYearCol(item.mod),
			...item
		}))
	);

	const ONE_YEAR_MS = 8760 * 3600 * 1000;
	function formatTimeYearCol(date: Date) {
		let parts = DateTime.fromJSDate(date);

		let month = parts.monthShort as string;
		let day = parts.day;
		let thirdCol =
			parts.diffNow().toMillis() < ONE_YEAR_MS
				? parts.year
				: parts.toFormat("HH:mm");

		// let time = parts.toFormat("HH:mm");
		// let year = parts.year;

		return {
			m: month,
			d: day,
			th: thirdCol
		};
	}
</script>

{#snippet lsla(item: FormattedChildItem)}
	<tr class="w-full overflow-hidden text-nowrap">
		<td class="pr-1 text-left tracking-[0.07em]">{item.perms}</td>
		<td class="pr-2 pl-4 text-right">{item.links}</td>
		<td class="pl-px text-left">{item.owner}</td>
		<td class="px-2 text-left">{item.group}</td>
		<td class="pr-2 text-right">{item.size}</td>
		<td class="px-1 text-right">{item.m}</td>
		<td class="px-1 text-right">{item.d}</td>
		<td class="flex-none px-1 text-right">{item.th}</td>
		<td class="min-w-1/2 pr-5 pl-4 text-left">{item.name}</td>
	</tr>
{/snippet}

<table class="max-w-full min-w-3/5">
	<tbody>
		{#each formattedItems as item}
			{@render lsla(item)}
		{/each}
	</tbody>
</table>
