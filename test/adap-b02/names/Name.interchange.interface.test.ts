import { describe, expect, it } from "vitest";
import { StringArrayName } from "../../../src/adap-b02/names/StringArrayName";
import { StringName } from "../../../src/adap-b02/names/StringName";
import { Name } from "../../../src/adap-b02/names/Name";

// helper: escape component for data string
function escapeComponent(c: string): string {
  return c.replace(/([\.\\])/g, "\\$1");
}

function toEscapedDataString(components: string[], delimiter: string = ".") {
  return components.map(escapeComponent).join(delimiter);
}

// helper: creates BOTH instances that must behave the same
function createInstances(components: string[], delimiter?: string): Name[] {
  const dataString = toEscapedDataString(components, delimiter ?? ".");
  return [
    new StringArrayName(components, delimiter),
    new StringName(dataString, delimiter),
  ];
}

// ------------------------ TESTS ------------------------------

describe("asString()", () => {
  it("returns correct default-delimiter string", () => {
    const components = ["version", "001", "alpha"];

    for (const n of createInstances(components)) {
      expect(n.asString()).equals("version.001.alpha");
    }
  });

  it("returns correct param delimiter", () => {
    const components = ["_foo", "_bar", "_baz"];

    for (const n of createInstances(components)) {
      expect(n.asString("/")).equals("_foo/_bar/_baz");
    }
  });

  it("uses init delimiter", () => {
    const components = ["version", "001", "alpha"];

    for (const n of createInstances(components, "%")) {
      expect(n.asString()).equals("version%001%alpha");
    }
  });

  it("init + param delimiter → param wins", () => {
    const components = ["a-1", "a-2", "a-3"];

    for (const n of createInstances(components, "$")) {
      expect(n.asString("-")).equals("a-1-a-2-a-3");
    }
  });

  it("throws error for empty input", () => {
    expect(() => new StringArrayName([])).toThrowError();
    expect(() => new StringName("", ".")).toThrowError();
  });
});

// ------------------------------------------------------------

describe("asDataString()", () => {
  it("without special chars", () => {
    const components = ["data123", "data456", "data789"];
    const expected = "data123.data456.data789";

    for (const n of createInstances(components)) {
      expect(n.asDataString()).equals(expected);
    }
  });

  it("with escaped characters", () => {
    const components = ["ab\\.", "c", "d", "e\\."];
    const expected = "ab\\\\\\..c.d.e\\\\\\.";

    for (const n of createInstances(components)) {
      expect(n.asDataString()).equals(expected);
    }
  });
});

// ------------------------------------------------------------

describe("getComponent()", () => {
  const components = ["alpha", "beta", "gamma", "delta", "epsilon", "zeta"];

  it("first index", () => {
    for (const n of createInstances(components, "/")) {
      expect(n.getComponent(0)).equals("alpha");
    }
  });

  it("middle index", () => {
    for (const n of createInstances(components, "/")) {
      expect(n.getComponent(2)).equals("gamma");
    }
  });

  it("last index", () => {
    for (const n of createInstances(components, "/")) {
      expect(n.getComponent(5)).equals("zeta");
    }
  });

  it("throws on invalid index", () => {
    for (const n of createInstances(components, "/")) {
      expect(() => n.getComponent(10)).toThrowError();
    }
  });
});

// ------------------------------------------------------------

describe("setComponent()", () => {
  const components = ["version!", "001", "alpha"];

  it("replaces first", () => {
    for (const n of createInstances(components)) {
      n.setComponent(0, "TeNeT");
      expect(n.asString()).equals("TeNeT.001.alpha");
    }
  });

  it("replaces last", () => {
    for (const n of createInstances(components)) {
      n.setComponent(2, "TeNeT");
      expect(n.asString()).equals("version!.001.TeNeT");
    }
  });
});

// ------------------------------------------------------------

describe("getNoComponents()", () => {
  const components = ["a", "b", "", "", "e"];

  it("returns correct amount", () => {
    for (const n of createInstances(components, "/")) {
      expect(n.getNoComponents()).toBe(5);
    }
  });
});

// ------------------------------------------------------------

describe("insert()", () => {
  const components = ["a-1", "a-2", "a-3"];

  it("insert at first", () => {
    for (const n of createInstances(components, "!")) {
      n.insert(0, "cc");
      expect(n.asString()).equals("cc!a-1!a-2!a-3");
    }
  });

  it("insert in middle", () => {
    for (const n of createInstances(components, "!")) {
      n.insert(1, "cc");
      expect(n.asString()).equals("a-1!cc!a-2!a-3");
    }
  });

  it("insert at end", () => {
    for (const n of createInstances(components, "!")) {
      n.insert(3, "cc");
      expect(n.asString()).equals("a-1!a-2!a-3!cc");
    }
  });
});

// ------------------------------------------------------------

describe("append()", () => {
  const components = ["a-1", "a-2", "a-3"];

  it("appends element", () => {
    for (const n of createInstances(components)) {
      n.append("Tenet");
      expect(n.asString()).equals("a-1.a-2.a-3.Tenet");
    }
  });
});

// ------------------------------------------------------------

describe("remove()", () => {
  const components = ["api", "v1", "users"];

  it("remove first", () => {
    for (const n of createInstances(components)) {
      n.remove(0);
      expect(n.asString()).equals("v1.users");
    }
  });

  it("remove last", () => {
    for (const n of createInstances(components)) {
      n.remove(2);
      expect(n.asString()).equals("api.v1");
    }
  });
});

// ------------------------------------------------------------

// Todo
describe("isEmpty()", () => {

});

// ------------------------------------------------------------

// todo
describe("concat()", () => {
    
});
