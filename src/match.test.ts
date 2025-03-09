import { Option, Result } from "./types";
import { match } from "./match";

describe("match", () => {
    test("matches Option some", () => {
        const opt = Option.some(42);
        const result = match(opt, {
            some: (v) => `Value: ${v}`,
            none: () => "None",
        });
        expect(result).toBe("Value: 42");
    });

    test("matches Option none", () => {
        const opt = Option.none<number>();
        const result = match(opt, {
            some: (v) => `Value: ${v}`,
            none: () => "None",
        });
        expect(result).toBe("None");
    });

    test("matches Result ok", () => {
        const res = Result.ok<number, string>(10);
        const result = match(res, {
            ok: (v) => `Ok: ${v}`,
            err: (e) => `Err: ${e}`,
        });
        expect(result).toBe("Ok: 10");
    });

    test("matches Result err", () => {
        const res = Result.err<number, string>("error");
        const result = match(res, {
            ok: (v) => `Ok: ${v}`,
            err: (e) => `Err: ${e}`,
        });
        expect(result).toBe("Err: error");
    });

    test("uses default when no match", () => {
        const opt = Option.some(42);
        const result = match(opt, { default: () => "Default" });
        expect(result).toBe("Default");
    });

    test("throws when no match and no default", () => {
        const opt = Option.some(42);
        expect(() => match(opt, {})).toThrow("No matching pattern");
    });
});