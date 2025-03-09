/**
 * Represents an optional value that may or may not be present, similar to Rust's `Option<T>`.
 * This class provides a type-safe way to handle nullable values with methods for chaining operations.
 */
class Option<T> {
    /**
     * Constructs an Option instance with a value or null.
     * @param value The value to store, or null if absent.
     */
    private constructor(private value: T | null) { }

    /**
     * Creates an Option containing a value (Some).
     * @template T The type of the value.
     * @param value The value to wrap in the Option.
     * @returns An Option instance representing Some(value).
     */
    static some<T>(value: T): Option<T> {
        return new Option(value);
    }

    /**
     * Creates an Option representing the absence of a value (None).
     * @template T The type of the value that would be present.
     * @returns An Option instance representing None.
     */
    static none<T>(): Option<T> {
        return new Option<T>(null);
    }

    /**
     * Checks if the Option contains a value (is Some).
     * @returns True if the Option is Some, false if None.
     */
    isSome(): boolean {
        return this.value !== null;
    }

    /**
     * Checks if the Option represents the absence of a value (is None).
     * @returns True if the Option is None, false if Some.
     */
    isNone(): boolean {
        return !this.isSome();
    }

    /**
     * Extracts the value from the Option, throwing an error if None.
     * @returns The contained value if Some.
     * @throws {Error} If the Option is None.
     */
    unwrap(): T {
        if (this.isNone()) throw new Error("Called unwrap on a None value");
        return this.value as T;
    }

    /**
     * Extracts the value from the Option or returns a default value if None.
     * @param defaultValue The value to return if the Option is None.
     * @returns The contained value if Some, or the default value if None.
     */
    unwrapOr(defaultValue: T): T {
        return this.isSome() ? this.value as T : defaultValue;
    }

    /**
     * Transforms the contained value using a function, returning a new Option.
     * If the Option is None, returns None without applying the function.
     * @template U The type of the transformed value.
     * @param fn The function to apply to the value.
     * @returns A new Option with the transformed value or None.
     */
    map<U>(fn: (value: T) => U): Option<U> {
        return this.isSome() ? Option.some(fn(this.value as T)) : Option.none();
    }
}

/**
 * Represents a value that may either be a success (Ok) or a failure (Err), similar to Rust's `Result<T, E>`.
 * This class provides methods to handle computations that might fail in a type-safe manner.
 */
class Result<T, E> {
    /**
     * Constructs a Result instance with either an Ok value or an Err value.
     * @param okValue The success value, or null if Err.
     * @param errValue The error value, or null if Ok.
     */
    private constructor(
        private okValue: T | null,
        private errValue: E | null
    ) { }

    /**
     * Creates a Result representing a successful computation (Ok).
     * @template T The type of the success value.
     * @template E The type of the potential error.
     * @param value The success value to wrap.
     * @returns A Result instance representing Ok(value).
     */
    static ok<T, E>(value: T): Result<T, E> {
        return new Result<T, E>(value, null);
    }

    /**
     * Creates a Result representing a failed computation (Err).
     * @template T The type of the potential success value.
     * @template E The type of the error.
     * @param error The error value to wrap.
     * @returns A Result instance representing Err(error).
     */
    static err<T, E>(error: E): Result<T, E> {
        return new Result<T, E>(null, error);
    }

    /**
     * Checks if the Result is a success (Ok).
     * @returns True if the Result is Ok, false if Err.
     */
    isOk(): boolean {
        return this.okValue !== null;
    }

    /**
     * Checks if the Result is a failure (Err).
     * @returns True if the Result is Err, false if Ok.
     */
    isErr(): boolean {
        return !this.isOk();
    }

    /**
     * Extracts the success value from the Result, throwing an error if Err.
     * @returns The contained value if Ok.
     * @throws {Error} If the Result is Err.
     */
    unwrap(): T {
        if (this.isErr()) throw new Error("Called unwrap on an Err value");
        return this.okValue as T;
    }

    /**
     * Extracts the error value from the Result, throwing an error if Ok.
     * @returns The contained error if Err.
     * @throws {Error} If the Result is Ok.
     */
    unwrapErr(): E {
        if (this.isOk()) throw new Error("Called unwrapErr on an Ok value");
        return this.errValue as E;
    }

    /**
     * Transforms the success value using a function, returning a new Result.
     * If the Result is Err, returns a new Err with the original error.
     * @template U The type of the transformed success value.
     * @param fn The function to apply to the success value.
     * @returns A new Result with the transformed value or the original error.
     */
    map<U>(fn: (value: T) => U): Result<U, E> {
        return this.isOk()
            ? Result.ok(fn(this.okValue as T))
            : Result.err(this.errValue as E);
    }

    /**
     * Transforms the error value using a function, returning a new Result.
     * If the Result is Ok, returns a new Ok with the original value.
     * @template F The type of the transformed error value.
     * @param fn The function to apply to the error value.
     * @returns A new Result with the original value or the transformed error.
     */
    mapErr<F>(fn: (error: E) => F): Result<T, F> {
        return this.isErr()
            ? Result.err(fn(this.errValue as E))
            : Result.ok(this.okValue as T);
    }
}

export { Option, Result };