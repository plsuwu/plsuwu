<script lang="ts">
	export let slug = '';
	export let title: string;

	const id = title
		.toLowerCase()
		.replace(/[^a-zA-Z ]/g, '')
		.replace(/\s/g, '-');

	const href = slug ? `/docs/writeups/${slug}` : '#' + id;
</script>

<div
	class="mb-3 max-w-fit text-xl font-bold italic transition-colors duration-300 ease-in-out group-hover:text-cat-peach lg:text-2xl text-left"
	{id}
>
	<a {href}>
		{title}
	</a>
</div>
