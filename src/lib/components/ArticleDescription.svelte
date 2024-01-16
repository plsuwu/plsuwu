<script lang="ts">
	export let description: string;

	function truncate(str: string, n: number) {
		return str.length > n ? str.slice(0, n - 1).trimEnd() + '...' : str;
	}

</script>

<p class="sm:p-4 p-2 pl-1 pb-0">
	<span class="my-1 text-cat-subtext0 italic text-start">
    <div class="mb-1 text-cat-overlay0">description: </div>
		<span class="text-lg">&ldquo;</span>{truncate(description, 64)}<span class="text-lg"
			>&rdquo;</span
		></span
	>
</p>
