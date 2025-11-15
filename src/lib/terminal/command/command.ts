import type { Component } from "svelte";

export interface CommandHistoryEntry {
	prompt: string;
	command: string;
	output: string;
    shouldRender?: boolean;
    extra?: any[];
	error?: boolean;
	timestamp: Date;
}

export interface Result<T, E> {
	output: T | E;
	error?: boolean;
}

export interface CommandResult<T = string, E = string> extends Result<T, E> {
	output: T | E;
	error?: boolean;
    shouldRender?: boolean;
    extra?: any[];
}

export interface CommandContext {
	args: string[];
	rawInput: string;
	history: CommandHistoryEntry[];
}

export abstract class Command<R = CommandResult> {
	abstract name: string;
	abstract description: string;
	abstract aliases?: string[];

	abstract execute(
		context: CommandContext
	): Promise<R> | R;

	protected parseFlags(args: string[]): {
		flags: Record<string, boolean | string>;
		remaining: string[];
	} {
		const flags: Record<string, boolean | string> = {};
		const remaining: string[] = [];

		for (let i = 0; i < args.length; i++) {
			const arg = args[i];

			if (arg.startsWith("--")) {
				const key = arg.slice(2);
				const next = args[i + 1];

				if (next && !next.startsWith("-")) {
					flags[key] = next;
					i++;
				} else {
					flags[key] = true;
				}
			} else if (arg.startsWith("-")) {
				flags[arg.slice(1)] = true;
			} else {
				remaining.push(arg);
			}
		}

		return { flags, remaining };
	}
}
