import type { CommandContext, CommandResult } from "terminal/command";
import type { TerminalState } from "terminal/terminal-state.svelte";
import { Command } from "terminal/command";

export class CdCommand extends Command {
	name = "cd";
	description = "change directory";
    aliases = undefined;

	constructor(private state: TerminalState) {
		super();
	}

	execute(ctx: CommandContext): CommandResult {
		const res = this.state.fs.setPwd(ctx.args[0]);
		if (!res.error) {
			this.state.currentDir = this.state.fs.getPwd();
			return { output: "" };
		}

		return { output: res.output as string, error: res.error };
	}
}

