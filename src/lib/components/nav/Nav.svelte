<script lang="ts">
	import { components } from "$lib/components/nav/components";
	import { NavigationMenu as Nm } from "bits-ui";
	import cn from "clsx";
	import CaretDown from "phosphor-svelte/lib/CaretDown";
	import type { Snippet } from "svelte";

	type ListItemProps = {
		className?: string;
		title: string;
		href: string;
		content: string;
	};
</script>

{#snippet ListItem({ className, title, content, href }: ListItemProps)}
	<li>
		<Nm.Link
			class={cn(
				"hover:bg-pink-base focus:bg-pink-base block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none",
				className
			)}
			{href}
		>
			<div class="text-sm leading-none font-medium">{title}</div>
			<p class="text-pink-semidark line-clamp-2 text-sm leading-snug">
				{content}
			</p>
		</Nm.Link>
	</li>
{/snippet}

<Nm.Root class="relative z-10 flex w-full justify-start mx-6 my-2 bg-pink">
	<Nm.List class="group flex list-non items-center justify-center p-0.5">
		<Nm.Item value="posts">
			<Nm.Trigger
				class="hover:text-pink-dark group inline-flex h-6 max-w-max items-center ease-in justify-center rounded-md bg-transparent px-3 py-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-pink-base hover:bg-pink-base"
			>
				<div
					class="group-hover:brightness-50 group-data-[state=open]:brightness-50"
				>
					posts
				</div>
				<CaretDown
					class="relative top-[1px] ml-1.5 size-3 transition-transform ease-in group-data-[state=open]:rotate-0 rotate-180 group-hover:brightness-50 group-data-[state=open]:brightness-50"
					aria-hidden="true"
				/>
			</Nm.Trigger>
			<Nm.Content
				class="data-[motion=from-end]:animate-enter-from-right data-[motion=from-start]:animate-enter-from-left data-[motion=to-end]:animate-exit-to-right data-[motion=to-start]:animate-exit-to-left absolute left-0 top-0 w-full sm:w-auto"
			>
				<ul
					class="m-0 grid list-none gap-x-2.5 p-3 sm:w-[600px] sm:grid-flow-col sm:grid-rows-3 sm:p-[22px]"
				>
					<li class="row-span-3 mb-2 sm:mb-0">
						<Nm.Link
							href="/"
							class="from-pink-base/50 to-pink-base bg-linear-to-b outline-hidden flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline focus:shadow-md"
						>
							<!-- <Icons.logo class="h-6 w-6" /> -->
							<div class="mb-2 mt-4 text-lg font-medium">
								Bits UI
							</div>
							<p
								class="text-muted-foreground text-sm leading-tight"
							>
								The headless components for Svelte.
							</p>
						</Nm.Link>
					</li>
					{@render ListItem({
						href: "#",
						title: "test",
						content: "this is a testing href :)",
					})}
				</ul></Nm.Content
			>
		</Nm.Item>
		<Nm.Indicator
			class="data-[state=hidden]:animate-fade-out data-[state=visible]:animate-fade-in top-full z-10 flex h-2.5 items-end justify-center overflow-hidden opacity-100 transition-[all,transform_250ms_ease] duration-200 data-[state=hidden]:opacity-0"
		>
			<div
				class="bg-border relative top-[70%] size-2.5 rotate-[45deg] rounded-tl-[2px]"
			></div>
		</Nm.Indicator>
	</Nm.List>
	<div
		class="perspective-[2000px] absolute left-0 top-full flex w-full justify-start"
	>
		<Nm.Viewport
			class="text-popover-foreground bg-pink-base data-[state=closed]:animate-scale-out data-[state=open]:animate-scale-in relative mt-2.5 h-[var(--bits-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-md border shadow-lg transition-[width,_height] duration-200 sm:w-[var(--bits-navigation-menu-viewport-width)] "
		/>
	</div>
</Nm.Root>
