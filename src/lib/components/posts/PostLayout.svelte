<script lang="ts">
	// import { onMount } from 'svelte';
	import Article from './Article.svelte';
	import type { BlogPost } from '$lib/utils/types';
	import { blur } from 'svelte/transition';
	import { expoIn, expoInOut, expoOut } from 'svelte/easing';

	export let sortedPosts: BlogPost[];
</script>

{#each sortedPosts as { slug, title, author, tags, area, description, date }, i}
	{#if title !== 'no results'}
		<div class="rounded-md border border-pink-200 p-1">
			{#key sortedPosts[i].title}
				<div
					in:blur={{
						delay: 10,
						duration: 300,
						easing: expoOut,
						opacity: 1,
						amount: 3,
					}}
					class={`justify-self-center rounded-md ${i % 2 !== 0 ? 'bg-l-whitepink/55' : 'bg-l-whitepink/25'}`}
				>
					<Article {slug} {title} {date} {author} {tags} {description} {area} />
				</div>
			{/key}
		</div>
	{:else}
		<div class="rounded-md border border-pink-200 p-1">
			<div
				class={`justify-center rounded-md py-4 text-center ${i % 2 !== 0 ? 'bg-l-whitepink/55' : 'bg-l-whitepink/25'}`}
			>
				no results!
			</div>
		</div>
	{/if}
{/each}
