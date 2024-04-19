<script lang="ts">
	import Desktop from '$lib/components/nav/Desktop.svelte';
	import Phone from './Phone.svelte';
</script>

<div class='hidden sm:block'>
<Desktop />
</div>
<div class='block sm:hidden absolute'>
<Phone />
</div>

