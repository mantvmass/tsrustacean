import { Option, Result } from "./types";

describe("Option", () => {
    test("some contains a value", () => {
        const opt = Option.some(42);
        expect(opt.isSome()).toBe(true);
        expect(opt.isNone()).toBe(false);
        expect(opt.unwrap()).toBe(42);
    });

    test("none is empty", () => {
        const opt = Option.none<number>();
        expect(opt.isSome()).toBe(false);
        expect(opt.isNone()).toBe(true);
        expect(() => opt.unwrap()).toThrow("Called unwrap on a None value");
        expect(opt.unwrapOr(0)).toBe(0);
    });

    test("map transforms value", () => {
        const opt = Option.some(42);
        const mapped = opt.map(x => x * 2);
        expect(mapped.unwrap()).toBe(84);

        const none = Option.none<number>();
        expect(none.map(x => x * 2).isNone()).toBe(true);
    });
});

describe("Result", () => {
    test("ok contains a value", () => {
        const res = Result.ok<number, string>(10);
        expect(res.isOk()).toBe(true);
        expect(res.isErr()).toBe(false);
        expect(res.unwrap()).toBe(10);
    });

    test("err contains an error", () => {
        const res = Result.err<number, string>("error");
        expect(res.isOk()).toBe(false);
        expect(res.isErr()).toBe(true);
        expect(res.unwrapErr()).toBe("error");
        expect(() => res.unwrap()).toThrow("Called unwrap on an Err value");
    });

    test("map transforms ok value", () => {
        const res = Result.ok<number, string>(10);
        const mapped = res.map(x => x * 2);
        expect(mapped.unwrap()).toBe(20);

        const err = Result.err<number, string>("error");
        expect(err.map(x => x * 2).unwrapErr()).toBe("error");
    });

    test("mapErr transforms error", () => {
        const res = Result.err<number, string>("error");
        const mapped = res.mapErr(e => e.toUpperCase());
        expect(mapped.unwrapErr()).toBe("ERROR");

        const ok = Result.ok<number, string>(10);
        expect(ok.mapErr(e => e.toUpperCase()).unwrap()).toBe(10);
    });
});