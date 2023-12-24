<script lang="ts">
	export let author: string;
	export let date: string;

	const formattedDate = new Date(date).toDateString();
</script>

<p class="space-x-2 mb-2 text-cat-overlay0 italic">
	<span class="">{author}</span> <span class="text-cat-text"> — </span>
	<span class="">{formattedDate}</span>
</p>
