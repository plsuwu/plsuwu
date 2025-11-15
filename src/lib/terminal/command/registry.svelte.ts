import type { Command, CommandContext, CommandResult } from "./command";

export class CommandRegistry {
	private commands = $state<Map<string, Command>>(new Map());

	register(command: Command) {
		this.commands.set(command.name, command);

		if (command.aliases) {
			command.aliases.forEach((alias) => {
				this.commands.set(alias, command);
			});
		}
	}

	unregister(commandName: string) {
		const command = this.commands.get(commandName);
		if (command) {
			this.commands.delete(commandName);

			if (command.aliases) {
				command.aliases.forEach((alias) => {
					this.commands.delete(alias);
				});
			}
		}
	}

	async execute(
		input: string,
		context: Omit<CommandContext, "args" | "rawInput">
	): Promise<CommandResult> {
		const trimmed = input.trim();
		if (!trimmed) {
			return { output: "" };
		}

		const parts = this.parseCommand(trimmed);
		const commandName = parts[0];
		const args = parts.slice(1);

		const command = this.commands.get(commandName);

		if (!command) {
			return {
				output: `command not found: ${commandName}`,
				error: true
			};
		}

		try {
			return await command.execute({
				args,
				rawInput: trimmed,
				history: context.history
			});
		} catch (err) {
			return {
				output: `error during execution: ${err instanceof Error ? err.message : String(err)}`,
				error: true
			};
		}
	}

	getCommand(name: string): Command | undefined {
		return this.commands.get(name);
	}

	getAllCommands(): Command[] {
		const uniqueCommands = new Map<string, Command>();
		this.commands.forEach((command) => {
			if (!uniqueCommands.has(command.name)) {
				uniqueCommands.set(command.name, command);
			}
		});

		return Array.from(uniqueCommands.values());
	}

	private parseCommand(input: string): string[] {
		const parts: string[] = [];
		let current = "";
		let isQuoted = false;
		let quoteChar = "";

		for (let i = 0; i < input.length; i++) {
			const char = input[i];

			if (
				(char === '"' || char === "'") &&
				(i === 0 || input[i - 1] !== "\\")
			) {
				if (!isQuoted) {
					isQuoted = true;
					quoteChar = char;
				} else if (char === quoteChar) {
					isQuoted = false;
					quoteChar = "";
				} else {
					current += char;
				}
			} else if (char === " " && !isQuoted) {
				if (current) {
					parts.push(current);
					current = "";
				}
			} else {
				current += char;
			}
		}

		if (current) {
			parts.push(current);
		}

		return parts;
	}
}
