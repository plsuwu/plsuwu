import { Command } from "terminal/command";
import type { CommandContext, CommandResult } from "terminal/command";
import type { FSDirectory } from "terminal/fs";
import type { TerminalState } from "terminal/terminal-state.svelte";

export class LsCommand extends Command {
	name = "ls";
	description = "list contents of current directory";
	aliases = ["dir", "la", "l"];

	constructor(private state: TerminalState) {
		super();
	}

	execute(ctx: CommandContext): CommandResult {
		const verbose = ctx.rawInput.trim() == "la" || ctx.args.includes("-la");
		let lsTarget =
			ctx.args.length > 0
				? (ctx.args.find((arg) => !arg.startsWith("-")) ?? null)
				: null;

		let target = lsTarget
			? (this.state.fs.getNode(lsTarget).output as FSDirectory)
			: this.state.fs.pwd;

		let items = this.state.fs.listDir(target);
		if (!verbose) {
			const itemNames = items
				.map((item) => item.name)
				.filter((item) => item != "." && item != "..")
				.join(" ");

			return { output: itemNames };
		}

		return { output: "_", shouldRender: true, extra: items };
	}
}
