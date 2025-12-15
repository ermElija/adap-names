import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b06/names/Name";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";

function createNames(): Name[] {
  return [
    new StringName("a.b.c"),
    new StringArrayName(["a", "b", "c"]),
  ];
}

describe("Name as Value Object", () => {

  describe("immutability through reference sharing", () => {
    it("does not mutate original when using append()", () => {
      const original: Name = new StringName("a.b");
      const alias: Name = original;

      const extended = alias.append("c");

      expect(original.toString()).toBe("a.b");
      expect(extended.toString()).toBe("a.b.c");
    });

    it("setComponent returns a new Name", () => {
      const name = new StringName("a.b.c");

      const modified = name.setComponent(1, "x");

      expect(name.toString()).toBe("a.b.c");
      expect(modified.toString()).toBe("a.x.c");
    });
  });

  describe("value equality", () => {
    it("equal values are equal across implementations", () => {
      const a: Name = new StringName("a.b.c");
      const b: Name = new StringArrayName(["a", "b", "c"]);

      expect(a.isEqual(b)).toBe(true);
      expect(b.isEqual(a)).toBe(true);
    });

    it("different values are not equal", () => {
      const a = new StringName("a.b");
      const b = new StringName("a.b.c");

      expect(a.isEqual(b)).toBe(false);
    });
  });

  describe("no hidden mutable state", () => {
    it("getComponent does not allow mutation of original", () => {
      const name = new StringArrayName(["a", "b"]);

      const component = name.getComponent(0);
      const modified = name.setComponent(0, component + "x");

      expect(name.toString()).toBe("a.b");
      expect(modified.toString()).toBe("ax.b");
    });
  });

  describe("functional chaining", () => {
    it("supports chaining of value operations", () => {
      const name: Name = new StringName("root");

      const result =
        name
          .append("usr")
          .insert(1, "local")
          .append("bin")
          .remove(0);

      expect(result.toString()).toBe("local.usr.bin");
      expect(name.toString()).toBe("root");
    });
  });

  describe("concat operation", () => {
    it("concat creates a new Name without mutating operands", () => {
      const a = new StringName("a.b");
      const b = new StringArrayName(["c", "d"]);

      const combined = a.concat(b);

      expect(a.toString()).toBe("a.b");
      expect(b.toString()).toBe("c.d");
      expect(combined.toString()).toBe("a.b.c.d");
    });
  });

  describe("uniform behavior via interface", () => {
    it("all implementations behave consistently", () => {
      for (const name of createNames()) {
        expect(name.getNoComponents()).toBe(3);

        const extended = name.append("x");
        expect(extended.getNoComponents()).toBe(4);

        const removed = extended.remove(0);
        expect(removed.getNoComponents()).toBe(3);
      }
    });
  });

});
