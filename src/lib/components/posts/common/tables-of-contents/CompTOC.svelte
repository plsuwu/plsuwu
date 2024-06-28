<script lang="ts">
	import SquareBraceButton from "$components/ui/squarebrace/SquareBraceButton.svelte";
	export let ctfs;

    function handleClick() {

    }
</script>

<div class="-ml-38 fixed mt-28 hidden w-1/5 3xl:w-1/4 flex-col items-end text-right xl:flex">
	<div class="mb-2 font-bold">ctf events {"&"} sites</div>
	<div class="flex flex-col items-end self-end text-right">
		{#each ctfs as c}
			<SquareBraceButton handleParentEvent={handleClick}>
            <div>{c}</div>
            </SquareBraceButton>
		{/each}
	</div>
</div>
