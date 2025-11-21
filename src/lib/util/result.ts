export type Ok<T> = Result<T, never>;
export type Err<E extends ErrorType> = Result<never, E>;

export type ErrorType = {
	_tag: string;
	[key: string]: any;
};

type Match<T, E extends ErrorType, U> = {
	Ok: (data: T) => U;
} & {
	[K in E["_tag"]]: (error: Extract<E, { _tag: K }>) => U;
};

export class Result<T, E extends ErrorType> {
	protected constructor(
		readonly _tag: "Ok" | "Err",
		protected readonly value: T | E
	) {}

	static ok<T>(data: T): Ok<T> {
		return new Result("Ok", data) as Ok<T>;
	}

	static err<E extends ErrorType>(error: E): Err<E> {
		return new Result("Err", error) as Err<E>;
	}

	isOk(): this is Ok<T> {
		return this._tag === "Ok";
	}

	isErr(): this is Err<E> {
		return this._tag === "Err";
	}

	get data(): T {
		if (this.isOk()) return this.value as T;
		throw new Error("attempted to extract T from `Ok<T>`, found  `Err<E>`");
	}

	get error(): E {
		if (this.isErr()) return this.value as E;
		throw new Error("attempted to extract E from `Err<E>`, found `Ok<T>`");
	}

	map<U>(f: (value: T) => U): Result<U, E> {
		return this.isOk()
			? Result.ok(f(this.data))
			: (this as unknown as Result<U, E>);
	}

	flatMap<U>(f: (value: T) => Result<U, E>): Result<U, E> {
		return this.isOk() ? f(this.data) : (this as unknown as Result<U, E>);
	}

	equals(that: unknown): boolean {
		return (
			that instanceof Result &&
			this._tag === that._tag &&
			this.value === that.value
		);
	}

	toJSON() {
		return {
			_tag: this._tag,
			[this._tag === "Ok" ? "data" : "error"]: this.value
		};
	}

	toString(): string {
		return JSON.stringify(this.toJSON());
	}

	[Symbol.for("nodejs.util.inspect.custom")]() {
		return this.toJSON();
	}

	static match<T, E extends ErrorType, U>(
		result: Result<T, E>,
		matching: Match<T, E, U>
	): U {
		if (result.isOk()) {
			return matching.Ok(result.data);
		} else {
			const errHandler = matching[result.error._tag as keyof typeof matching];
			if (errHandler) {
				return errHandler(result.error as any);
			}

			throw new Error(`unhandled err type: ${result.error._tag}`);
		}
	}
}
