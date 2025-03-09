/**
 * Represents an optional value, similar to Rust's `Option<T>`.
 * Provides chainable methods for handling nullable values efficiently.
 */
export class Option<T> {
    private constructor(private value: T | null) { }

    static some<T>(value: T): Option<T> {
        return new Option(value);
    }

    static none<T>(): Option<T> {
        return new Option<T>(null);
    }

    isSome(): boolean {
        return this.value !== null;
    }

    isNone(): boolean {
        return !this.isSome();
    }

    unwrap(): T {
        if (this.isNone()) throw new Error("Called unwrap on a None value");
        return this.value as T;
    }

    unwrapOr(defaultValue: T): T {
        return this.isSome() ? this.value as T : defaultValue;
    }

    map<U>(fn: (value: T) => U): Option<U> {
        return this.isSome() ? Option.some(fn(this.value as T)) : Option.none();
    }

    andThen<U>(fn: (value: T) => Option<U>): Option<U> {
        return this.isSome() ? fn(this.value as T) : Option.none();
    }

    orElse(fn: () => Option<T>): Option<T> {
        return this.isSome() ? this : fn();
    }

    filter(fn: (value: T) => boolean): Option<T> {
        return this.isSome() && fn(this.value as T) ? this : Option.none();
    }
}

/**
 * Represents a computation result, either success (Ok) or failure (Err), like Rust's `Result<T, E>`.
 * Includes chainable methods for error handling.
 */
export class Result<T, E> {
    private constructor(
        private okValue: T | null,
        private errValue: E | null
    ) { }

    static ok<T, E>(value: T): Result<T, E> {
        return new Result<T, E>(value, null);
    }

    static err<T, E>(error: E): Result<T, E> {
        return new Result<T, E>(null, error);
    }

    isOk(): boolean {
        return this.okValue !== null;
    }

    isErr(): boolean {
        return !this.isOk();
    }

    unwrap(): T {
        if (this.isErr()) throw new Error("Called unwrap on an Err value");
        return this.okValue as T;
    }

    unwrapErr(): E {
        if (this.isOk()) throw new Error("Called unwrapErr on an Ok value");
        return this.errValue as E;
    }

    map<U>(fn: (value: T) => U): Result<U, E> {
        return this.isOk()
            ? Result.ok(fn(this.okValue as T))
            : Result.err(this.errValue as E);
    }

    mapErr<F>(fn: (error: E) => F): Result<T, F> {
        return this.isErr()
            ? Result.err(fn(this.errValue as E))
            : Result.ok(this.okValue as T);
    }

    andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
        return this.isOk() ? fn(this.okValue as T) : Result.err(this.errValue as E);
    }

    orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F> {
        return this.isErr() ? fn(this.errValue as E) : Result.ok(this.okValue as T);
    }
}

/**
 * A wrapper around JavaScript's string with additional chainable utility methods.
 * Inspired by Rust's `String` type for consistent string handling.
 */
export class String {
    constructor(private value: string) { }

    static from(value: string): String {
        return new String(value);
    }

    toString(): string {
        return this.value;
    }

    length(): number {
        return this.value.length;
    }

    concat(other: String | string): String {
        const otherValue = other instanceof String ? other.toString() : other;
        return new String(this.value + otherValue);
    }

    slice(start: number, end?: number): String {
        return new String(this.value.slice(start, end));
    }

    toUpperCase(): String {
        return new String(this.value.toUpperCase());
    }

    toLowerCase(): String {
        return new String(this.value.toLowerCase());
    }

    trim(): String {
        return new String(this.value.trim());
    }

    includes(search: string): boolean {
        return this.value.includes(search);
    }
}