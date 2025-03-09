import { serialize, deserialize, debug, defaultValue, Rename } from "./derive";

class TestClass {
    id: string = "";
    @Rename("full_name")
    name?: string;
    value: number = 0;
    // [key: string]: unknown;
}

describe("derive", () => {
    test("serialize renames and transforms values", () => {
        const obj = { id: "1", name: "John", value: 100 };
        const result = serialize(obj, {
            rename: { name: "full_name" },
            customSerializers: { value: (v: number) => v / 100 },
        });
        expect(result).toEqual({ id: "1", full_name: "John", value: 1 });
    });

    test("deserialize populates instance", () => {
        const json = { id: "1", full_name: "John", value: 100 };
        const instance = deserialize(json, TestClass, { rename: { name: "full_name" } });
        expect(instance.id).toBe("1");
        expect(instance.name).toBe("John");
        expect(instance.value).toBe(100);
    });

    test("debug formats object", () => {
        const obj = { id: "1", name: "John" };
        const result = debug(obj);
        expect(result).toBe('{\n  "id": "1",\n  "name": "John"\n}');
    });

    test("defaultValue creates instance", () => {
        const instance = defaultValue(TestClass);
        expect(instance.id).toBe("");
        expect(instance.name).toBeUndefined();
        expect(instance.value).toBe(0);
    });
});