import type { CommandHistoryEntry } from "./command";
import { FileSystem } from "./fs";

export class TerminalState {
	private _backingFs = new FileSystem();
	history = $state<CommandHistoryEntry[]>([]);
	currentInput = $state("");
	commandHistory = $state<string[]>([]);
	historyIdx = $state(-1);
	isProcessing = $state(false);
	fs = $state(this._backingFs);
	currentDir = $derived.by(() => this.fs.getPwd());

	// username = $state('peas');
	// hostname = $state('hello');

	get prompt() {
		return `${this.currentDir} $:`;
	}

	pushHistory(entry: CommandHistoryEntry) {
		this.history.push(entry);
	}

	addCommand(command: string) {
		if (command.trim()) {
			this.commandHistory.push(command.toString());
			this.historyIdx = this.commandHistory.length;
		}
	}

	navigateHistory(direction: "up" | "down"): string | null {
		if (direction === "up") {
			if (this.historyIdx > 0) {
				this.historyIdx--;
				return this.commandHistory[this.historyIdx];
			}
		} else {
			if (this.historyIdx < this.commandHistory.length - 1) {
				this.historyIdx++;
				return this.commandHistory[this.historyIdx];
			} else {
				this.historyIdx = this.commandHistory.length;
				return "";
			}
		}

		return null;
	}

	setDirectory(path: string) {
		const res = this.fs.setPwd(path.trim());
		if (!res.error) {
			this.currentDir = this.fs.getPwd();
		}
	}

	clear() {
		this.history = [];
	}
}
