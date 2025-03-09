import "reflect-metadata";
import { Option } from "../types";
import { registerPlugin, DerivePlugin } from "../derive";

// Metadata key for serde options
export const METADATA_KEY = Symbol("serde_metadata");

// Serde options interface
interface SerdeOptions {
    rename?: string;
    default?: any | (() => any);
    serialize_with?: (value: any) => any;
}

/**
 * Decorator to configure serialization/deserialization behavior for a property.
 */
export function serde(options: SerdeOptions = {}) {
    return function (target: any, propertyKey: string) {
        const metadata = Reflect.getMetadata(METADATA_KEY, target) || {};
        metadata[propertyKey] = options;
        Reflect.defineMetadata(METADATA_KEY, metadata, target);
    };
}

/** Feature flag for enabling serialization. */
export const Serialize = "Serialize" as const;
/** Feature flag for enabling deserialization. */
export const Deserialize = "Deserialize" as const;

/**
 * Interface for classes with Serialize feature.
 */
export interface Serializable {
    serialize(): Record<string, any>;
}

/**
 * Interface for classes with Deserialize feature.
 */
export interface Deserializable {
    deserialize(data: Record<string, any>): any;
    from(source: any): any;
}

// Serialize plugin with type definition
const serializePlugin: DerivePlugin = {
    feature: Serialize,
    extendPrototype: (prototype) => {
        Object.defineProperty(prototype, "serialize", {
            value: function (): Record<string, any> {
                const metadata = Reflect.getMetadata(METADATA_KEY, this) || {};
                const result: Record<string, any> = {};

                const keys = Object.keys(this);
                for (const key of keys) {
                    const options = metadata[key] || {};
                    const value = (this as any)[key];
                    const newKey = options.rename || key;

                    const unwrappedValue =
                        value instanceof Option ? value.unwrapOr(null) : value;
                    result[newKey] = options.serialize_with
                        ? options.serialize_with(unwrappedValue)
                        : unwrappedValue;
                }
                return result;
            },
            writable: true,
            configurable: true,
        });
    },
    instanceType: { serialize: (): Record<string, any> => ({} as any) },
};

// Deserialize plugin with type definition
const deserializePlugin: DerivePlugin = {
    feature: Deserialize,
    extendConstructor: (constructor) => {
        Object.defineProperty(constructor, "deserialize", {
            value: function (data: Record<string, any>): any {
                const instance = new this();
                const metadata = Reflect.getMetadata(METADATA_KEY, instance) || {};

                for (const [key, value] of Object.entries(data)) {
                    const options = Object.values(metadata).find(
                        (opt: any) => opt.rename === key
                    ) as any;
                    const targetKey =
                        options && options.rename
                            ? Object.keys(metadata).find(
                                (k) => metadata[k].rename === key
                            )
                            : key;

                    if (targetKey) {
                        const propType = Reflect.getMetadata(
                            "design:type",
                            instance,
                            targetKey
                        );
                        (instance as any)[targetKey] =
                            propType === Option && value !== null
                                ? Option.some(value)
                                : value;
                    }
                }
                return instance;
            },
            writable: true,
            configurable: true,
        });

        Object.defineProperty(constructor, "from", {
            value: function (source: any): any {
                const instance = new this();
                for (const key of Object.keys(source)) {
                    if (key in instance) {
                        const propType = Reflect.getMetadata(
                            "design:type",
                            instance,
                            key
                        );
                        const value = source[key];
                        (instance as any)[key] =
                            propType === Option && value !== null
                                ? Option.some(value)
                                : value;
                    }
                }
                return instance;
            },
            writable: true,
            configurable: true,
        });
    },
    initializeInstance: (instance) => {
        const metadata = Reflect.getMetadata(METADATA_KEY, instance) || {};
        for (const key of Object.keys(metadata)) {
            const options = metadata[key];
            if (
                options.default !== undefined &&
                (instance as any)[key] === undefined
            ) {
                (instance as any)[key] =
                    typeof options.default === "function"
                        ? options.default()
                        : options.default;
            }
        }
    },
    constructorType: {
        deserialize: (data: Record<string, any>): any => ({} as any),
        from: (source: any): any => ({} as any),
    },
};

// Register plugins with derive
registerPlugin(serializePlugin);
registerPlugin(deserializePlugin);

// export { Serialize, Deserialize, serde, Serializable, Deserializable };