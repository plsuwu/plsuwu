<script lang="ts">
	import { Banner } from "components/landing";
	import { onMount } from "svelte";
	import init, { FileSystem, create_fs } from "wasm";

	let fs: FileSystem | undefined = $state(undefined);
	onMount(async () => {
		await init();

		fs = new FileSystem();
		const node = fs.get_node("/home");

		console.log(node.name());
		// console.log(fs.list_dir("/"));
        const children = fs.list_dir("/");
        children.forEach((child) => {
            console.log(child.metadata());
        });
	});
</script>

<div class="flex w-full flex-col items-center justify-center">
	<Banner />

	{#if !fs}
		<div>loading</div>
	{/if}

	<!-- <button onclick={() => wasm.greet()}>greet</button> -->
	<!-- <Terminal /> -->
</div>
