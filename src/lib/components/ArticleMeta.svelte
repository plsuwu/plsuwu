<script lang="ts">
    export let author: string;
    export let date: string;
    export let tags: string[];
    const formattedDate = new Date(date).toDateString();

    // TODO: filter-by-tag func

    function eval_tag(tag: string) {
        let color = "";

            switch (tag) {
                case "capture the flag":
                    color = "text-cat-peach/40";
                    return color;
                case "huntress":
                    color = "text-cat-sapphire/40";
                    return color;
                case "hackthebox":
                    color = "text-cat-green/40";
                    return color;
                case "0x0539":
                    color = "text-cat-maroon/40";
                    return color;
                case "tryhackme":
                    color = "text-cat-red/40";
                    return color;
                case "binex":
                    color = "text-cat-flamingo/40";
                    return color;
                case "forensics":
                    color = "text-cat-sky/40";
                    return color;
                case "malware":
                    color = "text-cat-red/40";
                    return color;
                case "reversing":
                    color = "text-cat-yellow/40";
                    return color;
                case "obfuscation":
                    color = "text-cat-teal/40";
                    return color;
                case "web":
                    color = "text-cat-pink/40";
                    return color;
                case "networks":
                    color = "text-cat-blue/40";
                    return color;

                default:
                    break;
                }
    }
</script>

<p class="space-x-2 mb-2 text-cat-overlay0 italic">
    <span class="ml-2">{formattedDate}</span> <span class=" text-cat-subtext0"> // </span>
    <span class="">{author}</span>
    <br />
    <span class=" text-cat-overlay0 mt-4">{tags.length} tags: </span>
    <span class="text-left">
    [{#each tags as tag, i}
        {#if i+1 !== tags.length}
            <span class={`${eval_tag(tag)}`}>{tag}</span>,
        {:else}
           <span class={`${eval_tag(tag)}`}>{tag}</span>
        {/if}
    {/each}]
    <br/>
    </span>
</p>
