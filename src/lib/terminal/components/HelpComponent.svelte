<script lang="ts">
	import type { HelpItem } from "terminal/command/bin/help.svelte";
	let { items }: { items: HelpItem[] } = $props();
</script>

{#snippet helpItem(item: HelpItem)}
	<tr>
		<td>
			<span class="mr-2 inline-block font-bold text-amber-50">{item.name}</span>
		</td>
		<td class="ml-1 flex">
			{#if item.aliases}
				<span class="font-bold">[</span>
				{#each item.aliases as alias, i}
					<div class="italic">
						<span
							>{alias}{#if i < item.aliases.length - 1},&nbsp{/if}</span
						>
					</div>
				{/each}
				<span class="font-bold">]</span>
			{/if}
		</td>
	</tr>
{/snippet}

<div>
	<div>commands:</div>
	<table class="ml-3">
		{#each items as item}
			{@render helpItem(item)}
		{/each}
	</table>
</div>
