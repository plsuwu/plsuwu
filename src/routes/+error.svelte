<script lang="ts">
	import { page } from "$app/state";
	import { fade } from "svelte/transition";

	let errorDetail = $derived(page.error);
</script>

<div
	in:fade
	class="bg-pink-based -z-50 -mt-48 flex flex-col items-center space-y-5"
>
	<div class="flex flex-row text-xl font-bold">
		ur last request produced an <div
			class="-mt-0.5 text-2xl text-red-700/45"
		>
			&nbsp;error&nbsp;
		</div>
		:/
	</div>
	<div class="flex w-max flex-col justify-center">
		<div class="my-4 rounded-lg bg-red-700/70 p-0.5 text-center font-mono">
			<div class="text-2xl font-bold">
				{page.status}
			</div>
		</div>
		<div class="text-medium text-lg font-medium">
			{errorDetail ? errorDetail.message : "unknown error"}
		</div>
	</div>
	<button
		class="text-medium opacity-45 hover:cursor-pointer hover:opacity-75"
		onclick={() => window.history.back()}>{"<--"} back</button
	>
</div>
