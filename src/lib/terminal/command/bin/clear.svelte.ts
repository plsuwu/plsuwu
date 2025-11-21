import type { CommandContext, CommandResult } from "terminal/command";
import type { TerminalState } from "terminal/terminal-state.svelte";
import { Command } from "terminal/command";

export const CLEAR_ALIASES = ["cls"];
export class ClearCommand extends Command {
	name = "clear";
	description = "clear the screen";
    aliases = CLEAR_ALIASES;

	constructor(private state: TerminalState) {
		super();
	}

	execute(_: CommandContext): CommandResult {
		this.state.clear();
		return { output: "" };
	}
}
