<script lang="ts">
	import { fade } from 'svelte/transition';
	import { expoIn, expoOut } from 'svelte/easing';

    import HeroiconsChevronUp from '~icons/heroicons/chevron-up';
	import ButtonNavigation from './ButtonNavigation.svelte';

	export let name: string;
	export let active: string;
	export let toggle: (name: string) => void;

	const handleClick = (event: MouseEvent) => {
		event.stopPropagation();
		toggle(name);
	};
</script>

<div class="w-full flex flex-row justify-items-center">
	<ButtonNavigation
		handleParentEvent={handleClick}
		classMod={active ? 'text-l-pink space-x-36' : 'space-x-2'}
	>
		<div>{name}</div>
		<HeroiconsChevronUp
			class={`${active ? 'rotate-180' : ''}
                transition-all duration-300 ease-in-out mt-px`}
		/>
	</ButtonNavigation>

	{#if active === name}
		<ul
			class={`absolute -ml-[0.15rem] mt-8 border border-l-pink/25 rounded-md w-52`}
			in:fade={{ duration: 200, easing: expoIn }}
			out:fade={{ duration: 200, easing: expoOut }}
		>
			<slot />
		</ul>
	{/if}
</div>
