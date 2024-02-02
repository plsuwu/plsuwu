<script lang="ts">

    import type { PageData } from './$types';
	import type { SvelteComponent } from 'svelte';
	import PhArrowLeft from 'virtual:icons/ph/arrow-left';

    export let data: PageData;

	type C = $$Generic<typeof SvelteComponent<string, string, string>>;
	$: component = data.component as unknown as C;



</script>

<div class="mt-14 lg:mt-0 w-full flex flex-col">
	<div class="self-center shadow-inner w-full  py-4">
		<div class="text-cat-text text-center font-bold">
			<div class="text-3xl text-center font-bold ">
			</div>
			<div class="flex flex-col w-full">
				<div class="mx-auto text-center space-x-5">
					<div class="inline-flex align-middle">
						<a
							href="/writeups"
							class="text-xl  hover:opacity-50 transition-opacity duration-300 ease-in-out space-x-4"
							><PhArrowLeft class="inline" /><span
								class=" font-normal underline text-base">back to writeups</span
							></a
						>
					</div>

				</div>
			</div>
		</div>

		<div
			class="mt-4  max-w-[1920px] rounded-xl mx-auto "
		>
			<!-- todo: need to triple check custom prose style -->
			<div class="text-sm p-4 p-12 mx-8 prose w-full">
				<svelte:component this={component}/>
			    <slot />


			</div>
		</div>
	</div>
</div>
