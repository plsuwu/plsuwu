<script lang='ts'>
    import type { PageData } from './$types';
    import type { SvelteComponent } from 'svelte';

    export let data: PageData;
    type C = $$Generic<typeof SvelteComponent<string, string, string>>;
    $: component = data.component as unknown as C;

</script>

<div>
    <svelte:component this={component} />
    <slot />
</div>
