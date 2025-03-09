import { Option, Result } from "./types";

/**
 * A fluent matcher for Option and Result types, simplifying pattern matching.
 * Inspired by Rust's `match` with a chainable API for ease of use.
 */
export class Match<T, U> {
    private constructor(
        private value: Option<T> | Result<T, any>,
        private result?: U
    ) { }

    /**
     * Starts a match operation on an Option or Result value.
     * @param value The value to match against.
     * @returns A Match instance for chaining.
     */
    static on<T, U>(value: Option<T> | Result<T, any>): Match<T, U> {
        return new Match(value);
    }

    /**
     * Handles the Some case for an Option.
     * @param fn The function to execute if the value is Some.
     * @returns The Match instance for chaining.
     */
    some(fn: (value: T) => U): Match<T, U> {
        if (this.result === undefined && this.value instanceof Option && this.value.isSome()) {
            this.result = fn(this.value.unwrap());
        }
        return this;
    }

    /**
     * Handles the None case for an Option.
     * @param fn The function to execute if the value is None.
     * @returns The Match instance for chaining.
     */
    none(fn: () => U): Match<T, U> {
        if (this.result === undefined && this.value instanceof Option && this.value.isNone()) {
            this.result = fn();
        }
        return this;
    }

    /**
     * Handles the Ok case for a Result.
     * @param fn The function to execute if the value is Ok.
     * @returns The Match instance for chaining.
     */
    ok(fn: (value: T) => U): Match<T, U> {
        if (this.result === undefined && this.value instanceof Result && this.value.isOk()) {
            this.result = fn(this.value.unwrap());
        }
        return this;
    }

    /**
     * Handles the Err case for a Result.
     * @param fn The function to execute if the value is Err.
     * @returns The Match instance for chaining.
     */
    err(fn: (error: any) => U): Match<T, U> {
        if (this.result === undefined && this.value instanceof Result && this.value.isErr()) {
            this.result = fn(this.value.unwrapErr());
        }
        return this;
    }

    /**
     * Provides a default case if no previous conditions match.
     * @param fn The function to execute as a fallback.
     * @returns The final result of the match operation.
     */
    default(fn: () => U): U {
        return this.result !== undefined ? this.result : fn();
    }
}