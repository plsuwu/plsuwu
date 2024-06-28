<script lang="ts">
	export let classMod: string;
</script>

<div
	class={`group flex flex-row justify-center space-x-2 group-hover:opacity-100 ${classMod}`}
>
	<div class="group opacity-100 transition-all duration-300 ease-in-out">[</div>
	<div class="group transition-all duration-300 ease-in-out">
		<slot />
	</div>
	<div class="group opacity-100 transition-all duration-300 ease-in-out">]</div>
</div>
