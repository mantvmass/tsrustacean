import { Option } from "./types";
import { Result } from "./types";

/**
 * Defines a pattern for matching Option or Result values, inspired by Rust's `match` expression.
 * @template T The type of the value to match.
 * @template U The type of the result after matching.
 */
type MatchPattern<T, U> = {
    /** Handler for Some(value) in Option. */
    some?: (value: T) => U;
    /** Handler for None in Option. */
    none?: () => U;
    /** Handler for Ok(value) in Result. */
    ok?: (value: T) => U;
    /** Handler for Err(error) in Result. */
    err?: (error: any) => U;
    /** Fallback handler if no pattern matches. */
    default?: () => U;
};

/**
 * Matches an Option or Result value against a pattern, returning the result of the matched handler.
 * @template T The type of the value to match.
 * @template U The type of the result after matching.
 * @param value The Option or Result instance to match.
 * @param pattern The pattern to apply.
 * @returns The result of the matched handler.
 * @throws {Error} If no matching pattern is provided.
 */
function match<T, U>(value: Option<T> | Result<T, any>, pattern: MatchPattern<T, U>): U {
    if (value instanceof Option) {
        if (value.isSome() && pattern.some) return pattern.some(value.unwrap());
        if (value.isNone() && pattern.none) return pattern.none();
    } else if (value instanceof Result) {
        if (value.isOk() && pattern.ok) return pattern.ok(value.unwrap());
        if (value.isErr() && pattern.err) return pattern.err(value.unwrapErr());
    }
    if (pattern.default) return pattern.default();
    throw new Error("No matching pattern");
}

export { match, MatchPattern };