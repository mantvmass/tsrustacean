/**
 * Options for customizing serialization behavior, inspired by Rust's `serde`.
 * Provides mechanisms to rename fields and apply custom serialization logic.
 */
type SerializationOptions = {
    /** A mapping of property names to their serialized names for field renaming. */
    rename?: Record<string, string>;
    /** Custom serialization functions for specific properties, allowing value transformation. */
    customSerializers?: Record<string, (value: any) => any>;
};

/**
 * Serializes an object into a key-value record with optional renaming and custom serialization.
 * Mimics Rust's `Serialize` trait, enabling flexible transformation of object properties.
 * @template T The type of the object to serialize, must be an object with string keys.
 * @param obj The object to serialize into a record.
 * @param options Optional customization for renaming fields and applying serializers.
 * @returns A serialized record with renamed keys and transformed values.
 */
function serialize<T extends Record<string, unknown>>(
    obj: T,
    options: SerializationOptions = {}
): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
        const newKey = options.rename?.[key] ?? key;
        const serializer = options.customSerializers?.[key];
        result[newKey] = serializer ? serializer(value) : value;
    }
    return result;
}

/**
 * Deserializes a JSON-like object into an instance of a specified class with optional renaming.
 * Inspired by Rust's `Deserialize` trait, this function populates a class instance from raw data.
 * @template T The type of the resulting instance.
 * @param json The JSON-like object to deserialize from.
 * @param ctor The constructor of the class to instantiate.
 * @param options Optional customization for mapping serialized field names to class properties.
 * @returns An instance of the class populated with deserialized data.
 */
function deserialize<T>(
    json: Record<string, any>,
    ctor: new () => T,
    options: SerializationOptions = {}
): T {
    const instance = new ctor();
    const renameMap = Object.entries(options.rename || {}).reduce(
        (acc, [k, v]) => ({ ...acc, [v]: k }),
        {} as Record<string, string>
    );
    for (const [key, value] of Object.entries(json)) {
        const targetKey = renameMap[key] ?? key;
        (instance as Record<string, any>)[targetKey] = value;
    }
    return instance;
}

/**
 * Generates a string representation of an object for debugging purposes.
 * Emulates Rust's `Debug` trait by providing a human-readable output of the object's structure.
 * @template T The type of the object to debug.
 * @param obj The object to represent as a string.
 * @returns A formatted JSON string of the object with proper indentation.
 */
function debug<T>(obj: T): string {
    return JSON.stringify(obj, null, 2);
}

/**
 * Creates a default instance of a class, mimicking Rust's `Default` trait.
 * Useful for initializing objects with their default state.
 * @template T The type of the class to instantiate.
 * @param ctor The constructor of the class.
 * @returns A new instance of the class with default values as defined by the constructor.
 */
function defaultValue<T>(ctor: new () => T): T {
    return new ctor();
}

/**
 * Decorator to rename a property during serialization, inspired by Rust's `serde(rename)`.
 * Requires `experimentalDecorators` to be enabled in `tsconfig.json`.
 * @param newName The name to use for the property in serialized output.
 * @returns A decorator function that registers the renaming metadata on the target object.
 */
function Rename(newName: string) {
    return function (target: any, propertyKey: string) {
        target.__renames = target.__renames || {};
        target.__renames[propertyKey] = newName;
    };
}

export { debug, serialize, deserialize, defaultValue, Rename, SerializationOptions };