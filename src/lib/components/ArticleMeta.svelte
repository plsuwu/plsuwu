<script lang="ts">
    export let author: string;
    export let date: string;
    export let tags: string[];
    const formattedDate = new Date(date).toDateString();
    const daysAgo = elapsedTime(new Date(date).getTime());

    function elapsedTime(date: number) {
        let seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;

        if (interval > 1) {
            return Math.floor(interval) + " years ago";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " months ago";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " days ago";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " hours ago";
        }
    }

    // TODO: filter-by-tag func

    function eval_tag(tag: string) {
        let color = "";

        switch (tag) {
            case "capture the flag":
                color = "text-cat-peach/75";
                return color;
            case "huntress":
                color = "text-cat-sapphire/75";
                return color;
            case "hackthebox":
                color = "text-cat-green/75";
                return color;
            case "0x0539":
                color = "text-cat-maroon/75";
                return color;
            case "tryhackme":
                color = "text-cat-red/75";
                return color;
            case "binex":
                color = "text-cat-flamingo/75";
                return color;
            case "forensics":
                color = "text-cat-sky/75";
                return color;
            case "malware":
                color = "text-cat-red/75";
                return color;
            case "reversing":
                color = "text-cat-yellow/75";
                return color;
            case "obfuscation":
                color = "text-cat-teal/75";
                return color;
            case "web":
                color = "text-cat-pink/75";
                return color;
            case "networks":
                color = "text-cat-blue/75";
                return color;

            default:
                break;
        }
    }
</script>

<div class="space-x-2 mb-2 italic">
    <span class="ml-2">posted {daysAgo} ({formattedDate})  </span>
    <span class=" "> </span>
    <div class="opacity-25">{author}</div>
    <div class="">{tags.length} tags:
    <span class="text-left">
        [ {#each tags as tag, i}
            {#if i + 1 !== tags.length}
                <span class={`${eval_tag(tag)}`}>{tag}</span>,
            {:else}
                <span class={`${eval_tag(tag)}`}>{tag}</span>
            {/if}
        {/each}]

    </span>
    </div>
</div>
