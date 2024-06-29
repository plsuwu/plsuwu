<script lang="ts">
	import { fade } from 'svelte/transition';
	import { expoIn, expoOut } from 'svelte/easing';

	import HeroiconsChevronUp from '~icons/heroicons/chevron-up';
	import ButtonNavigation from './ButtonNavigation.svelte';

	export let name: string;
	export let active: string;
	export let setRoute: (name: string) => void;

	const handleClick = (event: MouseEvent) => {
		event.stopPropagation();
		setRoute(name);
	};
</script>

<div class="flex w-full flex-row justify-items-center">
	<ButtonNavigation
		handleParentEvent={handleClick}
		classMod={active ? 'text-l-pink space-x-36' : 'space-x-2'}
	>
		<div>{name}</div>
		<HeroiconsChevronUp
			class={`${active ? 'rotate-180' : ''} mt-px transition-all duration-300 ease-in-out`}
		/>
	</ButtonNavigation>

	{#if active === name}
		<ul
			class={`absolute -ml-[0.15rem] mt-8 w-52 min-w-52 rounded-md border border-l-pink/25 backdrop-blur-sm bg-white/75 z-50`}
			in:fade={{ duration: 200, easing: expoIn }}
			out:fade={{ duration: 200, easing: expoOut }}
		>
			<slot />
		</ul>
	{/if}
</div>
