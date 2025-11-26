<script lang="ts">
	import { Banner } from "components/landing";
	import { onMount } from "svelte";
	import init, { WasmFs } from "wasm";

	let fs: WasmFs | undefined = $state(undefined);
	onMount(async () => {
		await init();

		fs = new WasmFs();
		const node = fs.getNode("/home");
		console.log(node);

        const pwd = fs.getPwd();
		let lsOutput = fs.listDir(pwd);
		console.log(lsOutput);

        const chdir = fs.changeDir("posts");
        console.log(chdir);

        lsOutput = fs.listDir(fs.getPwd());

		console.log(lsOutput);
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
