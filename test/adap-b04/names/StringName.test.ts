import { describe, it, expect } from "vitest";
import { StringName } from "../../../src/adap-b04/names/StringName";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

describe("StringName", () => {

    // ------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------
    describe("constructor()", () => {

        it("constructs a valid StringName", () => {
            const n = new StringName("a\\.b.c", ".");
            expect(n.getNoComponents()).toBe(2);
        });

        it("throws if input has unmasked delimiter", () => {
            expect(() => new StringName("a.b", "b"))
                .toThrow(Error);
        });

        it("throws if empty source", () => {
            expect(() => new StringName(""))
                .toThrow(Error);
        });
    });

    // ------------------------------------------------------------
    // clone()
    // ------------------------------------------------------------
    describe("clone()", () => {

        it("returns equal but not identical instance", () => {
            const n1 = new StringName("a\\.b.c", ".");
            const n2 = n1.clone();

            expect(n2.asDataString()).toBe(n1.asDataString());
            expect(n2).not.toBe(n1);
        });
    });

    // ------------------------------------------------------------
    // asString()
    // ------------------------------------------------------------
    describe("asString()", () => {

        it("correctly unescapes values", () => {
            const n = new StringName("a\\.b.c", ".");
            const s = n.asString(".");
            expect(s).toBe("a.b.c");
        });

        it("throws for invalid delimiter input", () => {
            const n = new StringName("a", ".");
            expect(() => n.asString("A")).toThrow(Error);
        });
    });

    // ------------------------------------------------------------
    // getComponent()
    // ------------------------------------------------------------
    describe("getComponent()", () => {

        it("returns components correctly", () => {
            const n = new StringName("a\\.b.c", ".");
            expect(n.getComponent(0)).toBe("a\\.b");
            expect(n.getComponent(1)).toBe("c");
        });

        it("throws for invalid index", () => {
            const n = new StringName("a.b", ".");
            expect(() => n.getComponent(5)).toThrow(Error);
        });
    });

    // ------------------------------------------------------------
    // setComponent()
    // ------------------------------------------------------------
    describe("setComponent()", () => {

        it("correctly sets a component", () => {
            const n = new StringName("a.b", ".");
            n.setComponent(1, "x");
            expect(n.asDataString()).toBe("a.x");
        });

        it("throws for invalid index", () => {
            const n = new StringName("a.b", ".");
            expect(() => n.setComponent(5, "x")).toThrow();
        });

        it("throws if replacing with unmasked", () => {
            const n = new StringName("a.b", ".");
            expect(() => n.setComponent(1, "x.y")).toThrow();
        });
    });

    // ------------------------------------------------------------
    // insert()
    // ------------------------------------------------------------
    describe("insert()", () => {

        it("inserts correctly", () => {
            const n = new StringName("a.b", ".");
            n.insert(1, "x");
            expect(n.asDataString()).toBe("a.x.b");
        });

        it("throws for invalid index", () => {
            const n = new StringName("a", ".");
            expect(() => n.insert(5, "x")).toThrow();
        });
    });

    // ------------------------------------------------------------
    // append()
    // ------------------------------------------------------------
    describe("append()", () => {

        it("appends a new component", () => {
            const n = new StringName("a.b", ".");
            n.append("c");
            expect(n.asDataString()).toBe("a.b.c");
        });

        it("throws for unmasked", () => {
            const n = new StringName("a", ".");
            expect(() => n.append("x.y")).toThrow();
        });
    });

    // ------------------------------------------------------------
    // remove()
    // ------------------------------------------------------------
    describe("remove()", () => {

        it("removes correctly", () => {
            const n = new StringName("a.b.c", ".");
            n.remove(1);
            expect(n.asDataString()).toBe("a.c");
        });

        it("throws for invalid index", () => {
            const n = new StringName("a", ".");
            expect(() => n.remove(5)).toThrow();
        });
    });

});
