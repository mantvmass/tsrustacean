import { defineFrom } from "./convert";

class Source {
    constructor(public id: string) { }
}

class Target {
    constructor(public id: string) { }
}

describe("convert", () => {
    test("defineFrom converts type", () => {
        const converter = defineFrom(Target, (src: Source) => new Target(src.id));
        const source = new Source("1");
        const target = converter.from(source);
        expect(target.id).toBe("1");
        expect(target).toBeInstanceOf(Target);
    });
});