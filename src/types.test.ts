import { Option, Result, String } from "./types";

describe("Option", () => {
    test("some creates Option with value", () => {
        const opt = Option.some(42);
        expect(opt.isSome()).toBe(true);
        expect(opt.isNone()).toBe(false);
        expect(opt.unwrap()).toBe(42);
    });

    test("none creates empty Option", () => {
        const opt = Option.none<number>();
        expect(opt.isSome()).toBe(false);
        expect(opt.isNone()).toBe(true);
        expect(() => opt.unwrap()).toThrow("Called unwrap on a None value");
        expect(opt.unwrapOr(0)).toBe(0);
    });

    test("map transforms Some value", () => {
        const opt = Option.some(42);
        const mapped = opt.map((x) => x * 2);
        expect(mapped.unwrap()).toBe(84);
    });

    test("map on None returns None", () => {
        const opt = Option.none<number>();
        const mapped = opt.map((x) => x * 2);
        expect(mapped.isNone()).toBe(true);
    });

    test("andThen chains Option", () => {
        const opt = Option.some(42);
        const chained = opt.andThen((x) => Option.some(x * 2));
        expect(chained.unwrap()).toBe(84);

        const none = Option.none<number>();
        expect(none.andThen((x) => Option.some(x * 2)).isNone()).toBe(true);
    });

    test("orElse provides fallback for None", () => {
        const opt = Option.none<number>();
        const fallback = opt.orElse(() => Option.some(100));
        expect(fallback.unwrap()).toBe(100);

        const some = Option.some(42);
        expect(some.orElse(() => Option.some(100)).unwrap()).toBe(42);
    });

    test("filter keeps or discards value", () => {
        const opt = Option.some(42);
        expect(opt.filter((x) => x > 40).unwrap()).toBe(42);
        expect(opt.filter((x) => x > 50).isNone()).toBe(true);
    });
});

describe("Result", () => {
    test("ok creates successful Result", () => {
        const res = Result.ok<number, string>(10);
        expect(res.isOk()).toBe(true);
        expect(res.isErr()).toBe(false);
        expect(res.unwrap()).toBe(10);
    });

    test("err creates failed Result", () => {
        const res = Result.err<number, string>("error");
        expect(res.isOk()).toBe(false);
        expect(res.isErr()).toBe(true);
        expect(res.unwrapErr()).toBe("error");
        expect(() => res.unwrap()).toThrow("Called unwrap on an Err value");
    });

    test("map transforms Ok value", () => {
        const res = Result.ok<number, string>(10);
        const mapped = res.map((x) => x * 2);
        expect(mapped.unwrap()).toBe(20);

        const err = Result.err<number, string>("error");
        expect(err.map((x) => x * 2).unwrapErr()).toBe("error");
    });

    test("mapErr transforms Err value", () => {
        const res = Result.err<number, string>("error");
        const mapped = res.mapErr((e) => e.toUpperCase());
        expect(mapped.unwrapErr()).toBe("ERROR");

        const ok = Result.ok<number, string>(10);
        expect(ok.mapErr((e) => e.toUpperCase()).unwrap()).toBe(10);
    });

    test("andThen chains Result", () => {
        const res = Result.ok<number, string>(10);
        const chained = res.andThen((x) => Result.ok(x * 2));
        expect(chained.unwrap()).toBe(20);

        const err = Result.err<number, string>("error");
        expect(err.andThen((x) => Result.ok(x * 2)).unwrapErr()).toBe("error");
    });

    test("orElse provides fallback for Err", () => {
        const res = Result.err<number, string>("error");
        const fallback = res.orElse((e) => Result.ok(100));
        expect(fallback.unwrap()).toBe(100);

        const ok = Result.ok<number, string>(10);
        expect(ok.orElse((e) => Result.ok(100)).unwrap()).toBe(10);
    });
});

describe("String", () => {
    test("from creates String instance", () => {
        const str = String.from("hello");
        expect(str.toString()).toBe("hello");
    });

    test("length returns string length", () => {
        const str = String.from("hello");
        expect(str.length()).toBe(5);
    });

    test("concat joins strings", () => {
        const str = String.from("hello");
        const result = str.concat(" world");
        expect(result.toString()).toBe("hello world");

        const str2 = String.from("!");
        expect(result.concat(str2).toString()).toBe("hello world!");
    });

    test("slice extracts substring", () => {
        const str = String.from("hello");
        expect(str.slice(1, 4).toString()).toBe("ell");
        expect(str.slice(0).toString()).toBe("hello");
    });

    test("toUpperCase converts to uppercase", () => {
        const str = String.from("hello");
        expect(str.toUpperCase().toString()).toBe("HELLO");
    });

    test("toLowerCase converts to lowercase", () => {
        const str = String.from("HELLO");
        expect(str.toLowerCase().toString()).toBe("hello");
    });

    test("trim removes whitespace", () => {
        const str = String.from("  hello  ");
        expect(str.trim().toString()).toBe("hello");
    });

    test("includes checks substring", () => {
        const str = String.from("hello world");
        expect(str.includes("world")).toBe(true);
        expect(str.includes("xyz")).toBe(false);
    });
});