<script lang="ts">
    import { page } from "$app/stores";
</script>

<div class="w-full flex flex-col mx-auto my-20">
    <div class="text-center">
        <div class="text-cat-red text-3xl font-bold">
            your request returned an error.
        </div>
        <div>
            responded with status '{$page.status}' ({$page.error?.message.toLowerCase()})
        </div>
    </div>
</div>
<div class="w-full flex flex-col text-center mx-auto my-20">

{"<"}- back to home --

</div>
