<script lang="ts">
	import { onMount } from "svelte";
	import { TerminalState } from "terminal/terminal-state.svelte";
	import { CommandRegistry, HelpCommand, ClearCommand } from "terminal/command";
	import { CdCommand } from "terminal/command/bin/cd.svelte";
	import { LsCommand } from "terminal/command/bin/ls.svelte";
	import LsLa from "./LsLa.svelte";

	let {
		initialDir = "~"
	}: {
		initialDir?: string;
	} = $props();

	const termState = new TerminalState();
	const registry = new CommandRegistry();

	let inputElement: HTMLInputElement;
	let terminalElement: HTMLDivElement;

	let cursorPos = $state(0);
	let isFocused = $state(false);
	let currentDir = $derived.by(() => {
		if (termState.fs.pwd.displayAlias) {
			return termState.fs.pwd.displayAlias;
		}

		return termState.fs.getPwd();
	});

	// $effect(() => {
	// 	$inspect(termState.fs.pwd);
	// 	currentDir = termState.fs.getPwd();
	// 	$inspect("updated: ", currentDir);
	// });

	const textBeforeCursor = $derived(termState.currentInput.slice(0, cursorPos));
	const charAtCursor = $derived(termState.currentInput[cursorPos] || " ");
	const textAfterCursor = $derived(
		termState.currentInput.slice(cursorPos + 1) || ""
	);

	// console.log(termState.setDirectory("a"));
	// termState.currentDir = initialDir;

	onMount(() => {
		registry.register(new HelpCommand(registry));
		registry.register(new ClearCommand(termState));
		registry.register(new CdCommand(termState));
		registry.register(new LsCommand(termState));
		if (inputElement) {
			updateCursor();
		}
	});

	async function handleSubmit() {
		const frozenState = termState.prompt.toString();
		const input = termState.currentInput.trim();
		if (!input) {
			termState.pushHistory({
				prompt: frozenState,
				command: " ",
				output: "",
				timestamp: new Date()
			});
		} else {
			termState.addCommand(input);
			termState.isProcessing = true;

			const result = await registry.execute(input, {
				history: termState.history
			});

			if (input !== "clear" && input !== "cls") {
				if (input.includes("ls -la") || input === "la") {
					termState.pushHistory({
						prompt: frozenState,
						command: input,
						output: result.output,
						shouldRender: true,
						extra: result.extra,
						error: result.error,
						timestamp: new Date()
					});
				} else {
					termState.pushHistory({
						prompt: frozenState,
						command: input,
						output: result.output,
						error: result.error,
						timestamp: new Date()
					});
				}
			}

			termState.currentInput = "";
			termState.isProcessing = false;
		}

		setTimeout(() => {
			if (!terminalElement) return;

			terminalElement?.scrollTo({
				top: terminalElement.scrollHeight,
				behavior: "smooth"
			});
		}, 0);
	}

	// $effect(() => {
	// 	if (inputElement) {
	// 		updateCursor();
	// 	}
	// });

	function updateCursor() {
		if (inputElement) {
			cursorPos = inputElement.selectionStart || 0;
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "l" && event.ctrlKey) {
			event.preventDefault();
			termState.clear();
		}

		if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
			updateCursor();
		}
	}

	function handleInput() {
		updateCursor();
	}

	function handleClick() {
		updateCursor();
	}

	function handleFocus() {
		isFocused = true;
		updateCursor();
	}

	function handleBlur() {
		isFocused = false;
		updateCursor();
	}
</script>

<div
	onkeydown={() => {}}
	class="terminal-container my-4 h-[700px] w-full max-w-[85%] cursor-text
    overflow-y-scroll rounded-md bg-black p-4 font-iosevka text-[#d4d4d4]
    transition-discrete duration-200 ease-out xl:max-w-[55%]"
	bind:this={terminalElement}
	onclick={() => {
		inputElement?.focus();
	}}
	role="button"
	tabindex="0"
>
	<div class="min-h-full w-full">
		{#each termState.history as entry}
			{#if entry.command}
				<div class="command-history flex gap-2">
					<span class="whitespace-nowrap">{entry.prompt}</span>
					<span class="text-[#d4d4d4]">{entry.command}</span>
				</div>
			{/if}
			{#if entry.output}
				{#if entry.shouldRender && entry.extra}
					<LsLa items={entry.extra} />
				{:else}
					<div
						class="command-history wrap-break-word whitespace-pre-wrap text-[#cccccc]"
					>
						{entry.output}
					</div>
				{/if}
			{/if}
		{/each}

		<div class="relative flex flex-row items-start gap-2">
			<span class="whitespace-nowrap text-[#d4d4d4]">{termState.prompt}</span>

			<!-- input wrapper -->
			<div class="relative flex-1">
				<span
					class="pointer-events-none relative inline-block whitespace-pre
                    text-[#d4d4d4]"
				>
					<span class="whitespace-pre">{textBeforeCursor}</span><span
						class="term-cursor relative m-0 inline w-min p-0"
						class:focused={isFocused}
						class:blink={isFocused}>{charAtCursor}</span
					>
					<span class="whitespace-pre">{textAfterCursor}</span>
				</span>
				<form
					class="absolute top-0 left-0 h-full w-full"
					onsubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
				>
					<input
						class="border-none bg-transparent p-0 text-transparent
                        caret-transparent outline-none focus:ring-0"
						bind:this={inputElement}
						bind:value={termState.currentInput}
						oninput={handleInput}
						onkeydown={handleKeyDown}
						onclick={handleClick}
						onfocus={handleFocus}
						onblur={handleBlur}
						disabled={termState.isProcessing}
						type="text"
						autocomplete="off"
						autocorrect="off"
						autocapitalize="off"
						spellcheck="false"
					/>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	.term-cursor {
		background-color: rgba(212, 212, 212, 0.5);
	}

	.term-cursor.focused {
		@apply bg-[#d4d4d4];
	}

	.term-cursor:not(.focused) {
		@apply bg-transparent;
		outline: 1px solid #d4d4d4;
		outline-offset: -1px;
	}

	.terminal-container::-webkit-scrollbar {
		width: 0;
	}

	.terminal-container {
		scrollbar-width: none;
	}

	@keyframes cursor-blink {
		0%,
		60% {
			opacity: 1;
		}

		61%,
		100% {
			opacity: 0;
		}
	}
</style>
