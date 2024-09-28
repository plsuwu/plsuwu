<script lang="ts">
	// import Camila from './chars/Camila.svelte';
    import Pippa from './chars/Pippa.svelte';

    const banners = [Pippa];
    const selection = () => {
        return Math.floor(Math.random() * (banners.length));
    }

    $: rand = banners[selection()];
</script>

<div class="py-3 bg-l-bgf">
	<div
		class="-z-50 flex flex-col items-center overflow-hidden whitespace-nowrap font-mono text-[9px] leading-[4px] tracking-[-0.335em]"
	>
    <a href='/'>
        <svelte:component this={rand} />
    </a>
	</div>
</div>
