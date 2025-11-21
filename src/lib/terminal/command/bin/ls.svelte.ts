import { Command } from "terminal/command";
import type { CommandContext, CommandResult } from "terminal/command";
import type { ChildItem, FSDirectory, TreeNode } from "terminal/fs";
import type { TerminalState } from "terminal/terminal-state.svelte";
import LsComponent from "terminal/components/LsComponent.svelte";

export type ListMultiOutput = {
	itemsInner: any[];
	extra: string;
	listAll?: boolean;
};
export const LS_ALIASES = ["dir", "la", "l"];

export class LsCommand extends Command {
	name = "ls";
	description = "list current directory";
	aliases = LS_ALIASES;

	constructor(private state: TerminalState) {
		super();
	}

	execute(ctx: CommandContext): CommandResult {
		const { flags, remaining } = this.parseFlags(ctx.args);
		if (!flags.la && ctx.rawInput.trim() === "la") {
			flags.la = true;
		}

		if (remaining.length === 0) {
			return this.listSingle(this.state.fs.pwd, flags.la);
		}

		return this.listMulti(remaining, flags.la);
	}

	listSingle(dir: FSDirectory, la: string | boolean): CommandResult {
		const items = this.state.fs.listDir(dir);

		if (!la) {
			const itemNames = items
				.filter((item) => item.name !== "." && item.name !== "..")
				.map((item) => item.name);

			return {
				output: "_",
				render: { items: itemNames, BindComponent: LsComponent }
			};
		}

		return {
			output: "_",
			render: {
				items,
				BindComponent: LsComponent
			}
		};
	}

	listMulti(targets: string[], la: string | boolean): CommandResult {
		const results: CommandResult = {
			output: "_",
			render: {
				items: new Array<ListMultiOutput>(),
				BindComponent: LsComponent
			}
		};

		for (const target of targets) {
			const dir = this.state.fs.getNode(target);
			if (dir.error || !dir.output) {
				// idk
				console.error("recv `dir.error` OR no `dir.output`:", dir);
				continue;
			}

			const { render } = this.listSingle(dir.output as FSDirectory, la);
			results.render!.items.push({
				itemsInner: render!.items,
				extra: target,
				listAll: la
			});
		}

		return results;
	}
}
