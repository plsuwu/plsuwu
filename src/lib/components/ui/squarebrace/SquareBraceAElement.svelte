<script lang="ts">

	export let href;
	export let classMod: string = '';
</script>

<a href={href} class="flex flex-row group group-hover:opacity-100 justify-center space-x-2">
	<div class="group opacity-25 group-hover:opacity-100 transition-all duration-300 ease-in-out">[</div>
        <div class="group group-hover:opacity-100  transition-all duration-300 ease-in-out opacity-50">
    	    <slot />
        </div>
	<div class="group opacity-25 group-hover:opacity-100 transition-all duration-300 ease-in-out">]</div>
</a>
