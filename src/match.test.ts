import { Option, Result } from "./types";
import { Match } from "./match";

describe("Match with Option", () => {
    test("matches Some case", () => {
        const opt = Option.some(42);
        const result = Match.on(opt)
            .some((value) => value * 2)
            .none(() => 0)
            .default(() => -1);
        expect(result).toBe(84);
    });

    test("matches None case", () => {
        const opt = Option.none<number>();
        const result = Match.on(opt)
            .some((value) => value * 2)
            .none(() => 0)
            .default(() => -1);
        expect(result).toBe(0);
    });

    test("uses default when no match", () => {
        const opt = Option.some(42);
        const result = Match.on(opt)
            .none(() => 0)
            .default(() => -1);
        expect(result).toBe(-1);
    });

    test("handles chaining with multiple conditions", () => {
        const opt = Option.some(42);
        const result = Match.on(opt)
            .some((value) => value + 1)
            .some((value) => value * 2) // Only first match applies
            .none(() => 0)
            .default(() => -1);
        expect(result).toBe(43); // First some wins
    });
});

describe("Match with Result", () => {
    test("matches Ok case", () => {
        const res = Result.ok<number, string>(10);
        const result = Match.on(res)
            .ok((value) => value * 2)
            .err((error) => error.length)
            .default(() => -1);
        expect(result).toBe(20);
    });

    test("matches Err case", () => {
        const res = Result.err<number, string>("error");
        const result = Match.on(res)
            .ok((value) => value * 2)
            .err((error) => error.toUpperCase())
            .default(() => -1);
        expect(result).toBe("ERROR");
    });

    test("uses default when no match", () => {
        const res = Result.err<number, string>("error");
        const result = Match.on(res)
            .ok((value) => value * 2)
            .default(() => -1);
        expect(result).toBe(-1);
    });

    test("handles chaining with multiple conditions", () => {
        const res = Result.ok<number, string>(10);
        const result = Match.on(res)
            .ok((value) => value + 1)
            .ok((value) => value * 2) // Only first match applies
            .err((error) => error.length)
            .default(() => -1);
        expect(result).toBe(11); // First ok wins
    });
});