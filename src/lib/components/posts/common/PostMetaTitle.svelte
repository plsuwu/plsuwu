<script lang="ts">
	export let from: string;
	export let title: string;
</script>

<div class="flex w-full flex-row lg:pb-2 lg:flex-col lg:justify-between">
	<div class="transition-colors duration-300 ease-in-out inline-flex w-full justify-self-stretch text-start text-lg underline italic lg:text-lg font-semibold overflow-visible whitespace-nowrap group group-hover:text-l-pink">
		{title}
	</div>
	<div class="flex w-full flex-row justify-end text-end font-medium whitespace-nowrap mt-2 tracking-tighter">
		<div class="w-full inline-flex justify-end lg:justify-start text-xs lg:text-sm">
			<div class="text-end font-mono italic inline-flex">/</div><div
				class="inline-flex text-end indent-2 font-mono italic opacity-50 text-sm lg:text-base">{from}</div
			><div class="text-end font-mono italic inline-flex">&nbsp;/</div>
		</div>
	</div>
</div>
