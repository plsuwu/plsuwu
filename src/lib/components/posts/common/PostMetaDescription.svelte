<script lang="ts">
    import { truncate } from '$utils/post';

    export let description: string;
    const formatted = truncate(description);
</script>

<div>
    <p class="italic text-justify">"{formatted}"</p>
</div>
