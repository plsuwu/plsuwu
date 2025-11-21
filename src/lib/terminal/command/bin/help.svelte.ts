import type {
	CommandContext,
	CommandResult,
	CommandRegistry
} from "terminal/command";
import { Command } from "terminal/command";
import HelpComponent from "terminal/components/HelpComponent.svelte";

export interface HelpItem {
	name: string;
	description: string;
	aliases?: string[];
}

export const HELP_ALIASES = ["?"];
export class HelpCommand extends Command {
	name = "help";
	description = "command help";
	aliases = HELP_ALIASES;

	constructor(private registry: CommandRegistry) {
		super();
	}

	execute(_: CommandContext): CommandResult {
		const commands = this.registry.getAllCommands();
		commands.sort((a, b) => a.name.localeCompare(b.name));

		return {
			output: "_",
			render: { items: commands, BindComponent: HelpComponent }
		};
	}
}
