<script lang="ts">
	import type { PageData } from './$types';
	import type { SvelteComponent } from 'svelte';

	import PostNavToc from '$components/posts/common/tables-of-contents/PostNavToc.svelte';

	export let data: PageData;
	type C = $$Generic<typeof SvelteComponent<string, string, string>>;
	$: component = data.component as unknown as C;
</script>

<div class="flex flex-col w-full items-center">
	<div class="w-full px-4 transition-all xl:w-[65%] 3xl:w-[45%]">
		<div class="prose">
			<svelte:component this={component} />
			<slot />
		</div>
	</div>
    <PostNavToc />
</div>
