import type {
	CommandContext,
	CommandResult,
	CommandRegistry
} from "terminal/command";
import { Command } from "terminal/command";

export class HelpCommand extends Command {
	name = "help";
	description = "command help";
	aliases = ["?", "h"];

	constructor(private registry: CommandRegistry) {
		super();
	}

	execute(_: CommandContext): CommandResult {
		const commands = this.registry.getAllCommands();

		let output = "commands: \n";
		commands
			.sort((a, b) => a.name.localeCompare(b.name))
			.forEach((cmd) => {
				const aliases =
					cmd.aliases && cmd.aliases.length > 0
						? `( ${cmd.aliases.join(", ")} )`
						: "";
				output += `${cmd.name.padEnd(6)}${aliases.padEnd(15)} - ${cmd.description}\n`;
			});

		return { output };
	}
}
