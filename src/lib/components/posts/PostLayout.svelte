<script lang="ts">
	import { onMount } from 'svelte';
	import Article from './Article.svelte';
	import type { BlogPost } from '$lib/utils/types';

	export let sortedPosts: BlogPost[];
</script>

<ul class="flex w-full flex-col space-y-4 self-center rounded-md sm:max-w-4xl xl:w-[65%]">
	{#each sortedPosts as { slug, title, author, tags, area, description, date }, i}
		<div class="rounded-md border border-pink-200 p-1">
			<div
				class={`justify-self-center rounded-md ${i % 2 !== 0 ? 'bg-l-whitepink/55' : 'bg-l-whitepink/25'}`}
			>
				<Article {slug} {title} {date} {author} {tags} {description} {area}/>
			</div>
		</div>
	{/each}
</ul>
