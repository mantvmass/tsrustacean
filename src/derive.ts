import "reflect-metadata";

/**
 * Interface for plugins to define features and their behavior, including type definitions.
 */
export interface DerivePlugin {
    feature: string;
    extendPrototype?: (prototype: any) => void;
    extendConstructor?: (constructor: any) => void;
    initializeInstance?: (instance: any) => void;
    instanceType?: object; // Type for instance methods/properties
    constructorType?: object; // Type for static methods/properties
}

/**
 * Base interface for classes that use @derive.
 */
export interface Derivable { }

// Registry to store available plugins
const pluginRegistry: Record<string, DerivePlugin> = {};

/**
 * Registers a plugin with the derive system.
 * @param plugin The plugin to register.
 */
export function registerPlugin(plugin: DerivePlugin) {
    pluginRegistry[plugin.feature] = plugin;
}

/**
 * Type utility to extract instance and constructor types from plugins dynamically.
 */
type DerivedTypes<TFeatures extends readonly string[]> = {
    [F in TFeatures[number]]: F extends keyof typeof pluginRegistry
    ? Pick<
        typeof pluginRegistry[F],
        "instanceType" | "constructorType"
    > extends infer P
    ? {
        [K in keyof P]: P[K] extends object ? P[K] : {};
    }[keyof P]
    : {}
    : {};
}[TFeatures[number]];

/**
 * Decorator to derive features for a class by applying registered plugins.
 * @param features List of features to derive (e.g., ["Serialize", "Deserialize"]).
 */
export function derive<const TFeatures extends readonly string[]>(
    features: TFeatures // Change from ...features to features
) {
    return function <T extends { new(...args: any[]): any }>(constructor: T) {
        const DerivedClass = class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                for (const feature of features) { // Loop through features array
                    const plugin = pluginRegistry[feature];
                    if (plugin?.initializeInstance) {
                        plugin.initializeInstance(this);
                    }
                }
            }
        };

        for (const feature of features) { // Loop through features array
            const plugin = pluginRegistry[feature];
            if (!plugin) {
                console.warn(`No plugin registered for feature: ${feature}`);
                continue;
            }
            if (plugin.extendPrototype) {
                plugin.extendPrototype(DerivedClass.prototype);
            }
            if (plugin.extendConstructor) {
                plugin.extendConstructor(DerivedClass);
            }
        }

        // Dynamically apply types from all registered plugins
        return DerivedClass as unknown as typeof DerivedClass &
            T &
            DerivedTypes<TFeatures>;
    };
}