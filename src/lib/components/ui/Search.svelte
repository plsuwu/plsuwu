<script lang="ts">
	$: query = '';
</script>

<div>
	<!-- <div class="">{query}</div> -->
	<input
		type="text"
		placeholder="search for something..."
		class="rounded-md bg-l-darkpink px-1 py-0.5 text-sm text-l-whitepink transition-colors duration-300 ease-in-out placeholder:p-1 placeholder:py-0.5 placeholder:text-sm placeholder:italic placeholder:text-l-whitepink placeholder:brightness-50 focus:bg-l-whitepink focus:text-l-darkpink"
		bind:value={query}
	/>
</div>
