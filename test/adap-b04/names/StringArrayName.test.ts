import { describe, it, expect } from "vitest";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

describe("StringArrayName", () => {

    // ------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------
    describe("constructor()", () => {

        it("creates a valid object with masked components", () => {
            const n = new StringArrayName(["a", "b", "c\\.d"]);
            expect(n.getNoComponents()).toBe(3);
        });

        it("throws if an unmasked delimiter appears", () => {
            expect(() => new StringArrayName(["a", "b.c"]))
                .toThrow(InvalidStateException);
        });
    });

    // ------------------------------------------------------------
    // clone()
    // ------------------------------------------------------------
    describe("clone()", () => {

        it("returns an equal but not identical copy", () => {
            const n1 = new StringArrayName(["a", "b", "c"]);
            const n2 = n1.clone();

            expect(n2.asDataString()).toBe(n1.asDataString());
            expect(n2).not.toBe(n1);
        });
    });

    // ------------------------------------------------------------
    // asString()
    // ------------------------------------------------------------
    describe("asString()", () => {

        it("returns an unescaped human-readable string", () => {
            const n = new StringArrayName(["a", "b", "c\\.d"]);
            expect(n.asString(".")).toBe("a.b.c.d");
        });

        it("throws for invalid delimiter", () => {
            const n = new StringArrayName(["a"]);
            expect(() => n.asString("A")).toThrow(InvalidStateException);
        });
    });

    // ------------------------------------------------------------
    // setComponent()
    // ------------------------------------------------------------
    describe("setComponent()", () => {

        it("replaces the component at index", () => {
            const n = new StringArrayName(["a", "b"]);
            n.setComponent(1, "x");
            expect(n.getComponent(1)).toBe("x");
        });

        it("throws on invalid index", () => {
            const n = new StringArrayName(["a"]);
            expect(() => n.setComponent(1, "x"))
                .toThrow(Error);
        });

        it("throws if new component unmasked", () => {
            const n = new StringArrayName(["a"]);
            expect(() => n.setComponent(0, "c.d"))
                .toThrow(InvalidStateException);
        });
    });

    // ------------------------------------------------------------
    // insert()
    // ------------------------------------------------------------
    describe("insert()", () => {

        it("inserts at a valid index", () => {
            const n = new StringArrayName(["a", "b"]);
            n.insert(1, "x");
            expect(n.asDataString()).toBe("a.x.b");
        });

        it("throws on invalid index", () => {
            const n = new StringArrayName(["a"]);
            expect(() => n.insert(5, "x"))
                .toThrow(Error);
        });
    });

    // ------------------------------------------------------------
    // append()
    // ------------------------------------------------------------
    describe("append()", () => {

        it("appends a new component", () => {
            const n = new StringArrayName(["a"]);
            n.append("b");
            expect(n.asDataString()).toBe("a.b");
        });

        it("throws if component is not masked", () => {
            const n = new StringArrayName(["a"]);
            expect(() => n.append("c.d"))
                .toThrow(InvalidStateException);
        });
    });

    // ------------------------------------------------------------
    // remove()
    // ------------------------------------------------------------
    describe("remove()", () => {

        it("removes the component", () => {
            const n = new StringArrayName(["a", "b", "c"]);
            n.remove(1);
            expect(n.asDataString()).toBe("a.c");
        });

        it("throws if index invalid", () => {
            const n = new StringArrayName(["a"]);
            expect(() => n.remove(5)).toThrow(Error);
        });
    });
});
