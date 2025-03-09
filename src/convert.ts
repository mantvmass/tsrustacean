/**
 * Interface defining a conversion from one type to another, similar to Rust's `From` trait.
 * @template T The source type.
 * @template U The target type.
 */
interface From<T, U> {
    /**
     * Converts a source value into the target type.
     * @param source The value to convert.
     * @returns The converted value of type U.
     */
    from(source: T): U;
}

/**
 * Defines a conversion function from one type to another, creating an implementation of `From`.
 * @template T The source type.
 * @template U The target type.
 * @param ctor The constructor of the target type.
 * @param fn The conversion function.
 * @returns An object implementing the `From` interface.
 */
function defineFrom<T, U>(ctor: new (...args: any[]) => U, fn: (source: T) => U): From<T, U> {
    return { from: fn };
}

export { From, defineFrom };