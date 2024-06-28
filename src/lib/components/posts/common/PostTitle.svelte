<script lang="ts">
	export let from: string;
	export let title: string;
</script>

<div class="flex w-full flex-col pb-2">
	<div class="text-xl font-semibold w-full">
		{title}
	</div>
	<div class="flex w-full flex-row justify-between indent-4 font-medium">
		<div>{">>"}&nbsp;<span class="italic">{from}</span></div>
	</div>
</div>
