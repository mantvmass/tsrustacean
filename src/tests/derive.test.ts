import "reflect-metadata";
import { derive } from "../derive";
import { serde, Serialize, Deserialize } from "../lib/serde";

// Use array literal with as const to ensure proper type inference
@derive([Serialize, Deserialize] as const)
class UserDTO {
    id: string;
    @serde({ serialize_with: (v: number) => v / 100 })
    balance: number;
    @serde({ default: "Sun, 09 Mar 2025 14:58:21 GMT", rename: "createdAt" })
    created_at?: string;

    constructor(id: string, balance: number) {
        this.id = id;
        this.balance = balance;
    }
}

// Empty array with as const
@derive([] as const)
class EmptyDerived {
    id: string = "test";
}

describe("derive with dynamic plugin types", () => {
    test("Serialize works with custom serializer", () => {
        const user = new UserDTO("1", 10000);
        // @ts-expect-error
        expect(user.serialize()).toEqual({ id: "1", balance: 100, createdAt: "Sun, 09 Mar 2025 14:58:21 GMT" });
    });

    test("Deserialize works with plain object", () => {
        // @ts-expect-error
        const user = UserDTO.deserialize({ id: "2", balance: 20000 });
        expect(user.id).toBe("2");
        expect(user.balance).toBe(20000);
        expect(user.serialize()).toEqual({ id: "2", balance: 200, createdAt: "Sun, 09 Mar 2025 14:58:21 GMT" });
    });

    test("from converts source object", () => {
        const raw = { id: "3", balance: 30000 };
        // @ts-expect-error
        const user = UserDTO.from(raw);
        expect(user.id).toBe("3");
        expect(user.balance).toBe(30000);
        expect(user.serialize()).toEqual({ id: "3", balance: 300, createdAt: "Sun, 09 Mar 2025 14:58:21 GMT" });
    });

    test("No methods added without features", () => {
        const empty = new EmptyDerived();
        expect((empty as any).serialize).toBeUndefined();
        expect((EmptyDerived as any).deserialize).toBeUndefined();
        expect((EmptyDerived as any).from).toBeUndefined();
    });

    test("Serialize only adds serialize method", () => {
        @derive([Serialize] as const)
        class SerializeOnly {
            id: string = "test";
        }
        const instance = new SerializeOnly();
        // @ts-expect-error
        expect(typeof instance.serialize).toBe("function");
        expect((SerializeOnly as any).deserialize).toBeUndefined();
        expect((SerializeOnly as any).from).toBeUndefined();
    });

    test("Deserialize only adds deserialize and from methods", () => {
        @derive([Deserialize] as const)
        class DeserializeOnly {
            id: string = "test";
        }
        const instance = new DeserializeOnly();
        expect((instance as any).serialize).toBeUndefined();
        // @ts-expect-error
        expect(typeof DeserializeOnly.deserialize).toBe("function");
        // @ts-expect-error
        expect(typeof DeserializeOnly.from).toBe("function");
    });
});