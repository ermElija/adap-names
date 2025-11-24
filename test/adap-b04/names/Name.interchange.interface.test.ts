import { describe, expect, it } from "vitest";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import { StringName } from "../../../src/adap-b04/names/StringName";

describe("asString tests", () => {
  it("returns correct string _ without init + param delimiter", () => {
    const n = new StringArrayName(["version", "001", "alpha"]);
    expect(n.asString()).equals("version.001.alpha");

    const n2 = new StringName("version.001.alpha");
    expect(n2.asString()).equals("version.001.alpha");
  });

  it("returns correct string _ without init but param delimiter", () => {
    const n = new StringArrayName(["_foo", "_bar", "_baz"]);
    expect(n.asString("/")).equals("_foo/_bar/_baz");

    const n2 = new StringName("_foo._bar._baz");
    expect(n2.asString("/")).equals("_foo/_bar/_baz");
  });

  it("returns correct string _ with init but no param delimiter", () => {
    const n = new StringArrayName(["version", "001", "alpha"], "%");
    expect(n.asString()).equals("version%001%alpha");

    const n2 = new StringName("version%001%alpha", "%");
    expect(n2.asString()).equals("version%001%alpha");
  });

  it("returns correct string _ with init + param delimiter", () => {
    const n = new StringArrayName(["a-1", "a-2", "a-3"], "$");
    expect(n.asString("-")).equals("a-1-a-2-a-3");

    const n2 = new StringName("a-1$a-2$a-3", "$");
    expect(n2.asString("-")).equals("a-1-a-2-a-3");
  });

  /*it("returns error for empty components iput", () => {
    expect(() => new StringArrayName([])).toThrowError();
    expect(() => new StringName("")).toThrowError();
  });*/
});

// ---------------------------------------------------------------

describe("asDataString test", () => {
  it("1_no_special_characters", () => {
    const n = new StringArrayName(["data123", "data456", "data789"]);
    expect(n.asDataString()).equals("data123.data456.data789");

    const n2 = new StringName("data123.data456.data789");
    expect(n2.asDataString()).equals("data123.data456.data789");
  });

  it("2_special_character", () => {
    const n = new StringArrayName(["ab\\.", "c", "d", "e\\."]);
    expect(n.asDataString()).equals("ab\\..c.d.e\\.");

    const n2 = new StringName("ab\\..c.d.e\\.");
    console.log("normal", n2.asString());
    expect(n2.asDataString()).equals("ab\\..c.d.e\\.");
  });
});

// ---------------------------------------------------------------

describe("getComponent()", () => {
  it("gets first component", () => {
    const arr = ["alpha", "beta", "gamma", "delta", "epsilon", "zeta"];

    const n = new StringArrayName(arr, "/");
    expect(n.getComponent(0)).equals("alpha");

    const n2 = new StringName("alpha/beta/gamma/delta/epsilon/zeta", "/");
    expect(n2.getComponent(0)).equals("alpha");
  });

  it("gets correct component", () => {
    const arr = ["alpha", "beta", "gamma", "delta", "epsilon", "zeta"];

    const n = new StringArrayName(arr, "/");
    expect(n.getComponent(2)).equals("gamma");

    const n2 = new StringName("alpha/beta/gamma/delta/epsilon/zeta", "/");
    expect(n2.getComponent(2)).equals("gamma");
  });

  it("gets last component", () => {
    const arr = ["alpha", "beta", "gamma", "delta", "epsilon", "zeta"];

    const n = new StringArrayName(arr, "/");
    expect(n.getComponent(5)).equals("zeta");

    const n2 = new StringName("alpha/beta/gamma/delta/epsilon/zeta", "/");
    expect(n2.getComponent(5)).equals("zeta");
  });

  it("throws error when index out of bound", () => {
    const arr = ["alpha", "beta", "gamma", "delta", "epsilon", "zeta"];

    const n = new StringArrayName(arr, "/");
    expect(() => n.getComponent(10)).toThrowError();

    const n2 = new StringName("alpha/beta/gamma/delta/epsilon/zeta", "/");
    expect(() => n2.getComponent(10)).toThrowError();
  });
});

// ---------------------------------------------------------------

describe("setComponent()", () => {
  it("sets replaces component in correct position", () => {
    const n = new StringArrayName(["version!", "001", "alpha"]);
    n.setComponent(0, "TeNeT");
    expect(n.asString()).equals("TeNeT.001.alpha");

    const n2 = new StringName("version!.001.alpha");
    n2.setComponent(0, "TeNeT");
    expect(n2.asString()).equals("TeNeT.001.alpha");
  });

  it("replaces last position correctly", () => {
    const n = new StringArrayName(["version!", "001", "alpha"]);
    n.setComponent(2, "TeNeT");
    expect(n.asString()).equals("version!.001.TeNeT");

    const n2 = new StringName("version!.001.alpha");
    n2.setComponent(2, "TeNeT");
    expect(n2.asString()).equals("version!.001.TeNeT");
  });
});

// ---------------------------------------------------------------

describe("getNoOfComponents()", () => {
  it("gets correct number of components", () => {
    const n = new StringArrayName(["a", "b", "", "", "e"], "/");
    expect(n.getNoComponents()).toBe(5);

    const n2 = new StringName("a/b///e", "/");
    expect(n2.getNoComponents()).toBe(5);
  });
});

// ---------------------------------------------------------------

describe("insert()", () => {
  it("inserts corectly at first position", () => {
    const n = new StringArrayName(["a-1", "a-2", "a-3"], "!");
    n.insert(0, "cc");
    expect(n.asString()).equals("cc!a-1!a-2!a-3");

    const n2 = new StringName("a-1!a-2!a-3", "!");
    n2.insert(0, "cc");
    expect(n2.asString()).equals("cc!a-1!a-2!a-3");
  });

  it("correctly inserts at some position", () => {
    const n = new StringArrayName(["a-1", "a-2", "a-3"], "!");
    n.insert(1, "cc");
    expect(n.asString()).equals("a-1!cc!a-2!a-3");

    const n2 = new StringName("a-1!a-2!a-3", "!");
    n2.insert(1, "cc");
    expect(n2.asString()).equals("a-1!cc!a-2!a-3");
  });

  it("correctly insersts at last position", () => {
    const n = new StringArrayName(["a-1", "a-2", "a-3"], "!");
    n.insert(3, "cc");
    expect(n.asString()).equals("a-1!a-2!a-3!cc");

    const n2 = new StringName("a-1!a-2!a-3", "!");
    n2.insert(3, "cc");
    expect(n2.asString()).equals("a-1!a-2!a-3!cc");
  });

  // Todo noComponents gets incremeted correctly
});

// ---------------------------------------------------------------

describe("append()", () => {
  it("appends correctly", () => {
    const n = new StringArrayName(["a-1", "a-2", "a-3"]);
    n.append("Tenet");
    expect(n.asString()).equals("a-1.a-2.a-3.Tenet");

    const n2 = new StringName("a-1.a-2.a-3");
    n2.append("Tenet");
    expect(n2.asString()).equals("a-1.a-2.a-3.Tenet");
  });
});

// ---------------------------------------------------------------

describe("remove()", () => {
  it("removes correctly at the beginning", () => {
    const n = new StringArrayName(["api", "v1", "users"]);
    n.remove(0);
    expect(n.asString()).equals("v1.users");

    const n2 = new StringName("api.v1.users");
    n2.remove(0);
    expect(n2.asString()).equals("v1.users");
  });

  it("removes correctly at the end", () => {
    const n = new StringArrayName(["api", "v1", "users"]);
    n.remove(2);
    expect(n.asString()).equals("api.v1");

    const n2 = new StringName("api.v1.users");
    n2.remove(2);
    expect(n2.asString()).equals("api.v1");
  });
});

// ------------------------------------------------------------

describe("isEmpty()", () => {
  it("returns false for non-empty component list", () => {
    const n = new StringArrayName(["api"]);
    expect(n.isEmpty()).toBe(false);

    const n2 = new StringName("api");
    expect(n2.isEmpty()).toBe(false);
  });

  it("returns false when any component is non-empty", () => {
    const n = new StringArrayName(["", "", "user"]);
    expect(n.isEmpty()).toBe(false);

    const n2 = new StringName("..user");
    expect(n2.isEmpty()).toBe(false);
  });
});

// ------------------------------------------------------------

describe("concat()", () => {
  it("concatenates two names (simple case)", () => {
    const n = new StringArrayName(["a", "b"]);
    const other = new StringArrayName(["c", "d"]);

    n.concat(other);
    expect(n.asString()).equals("a.b.c.d");

    const n2 = new StringName("a.b");
    const other2 = new StringName("c.d");

    n2.concat(other2);
    expect(n2.asString()).equals("a.b.c.d");
  });

  it("concatenates with different delimiters – left delimiter is used", () => {
    const n = new StringArrayName(["root", "A"], "/");
    const other = new StringArrayName(["B", "C"], "-");

    n.concat(other);
    expect(n.asString()).equals("root/A/B/C");

    const n2 = new StringName("root/A", "/");
    const other2 = new StringName("B-C", "-");

    n2.concat(other2);
    expect(n2.asString()).equals("root/A/B/C");
  });

  it("concatenates multiple components correctly", () => {
    const n = new StringArrayName(["env", "prod"]);
    const other = new StringArrayName(["us-east", "node42"]);

    n.concat(other);
    expect(n.asString()).equals("env.prod.us-east.node42");

    const n2 = new StringName("env.prod");
    const other2 = new StringName("us-east.node42");

    n2.concat(other2);
    expect(n2.asString()).equals("env.prod.us-east.node42");
  });
});

// ------------------------------------------------------------

describe("clone()", () => {
  it("creates a deep copy with equal content but different reference", () => {
    const n = new StringArrayName(["foo", "bar", "baz"]);
    const clone = n.clone();

    // gleiche inhaltliche Repräsentation
    expect(clone.asDataString()).toBe(n.asDataString());
    // equals-Semantik
    expect(clone.isEqual(n)).toBe(true);
    // unterschiedliche Referenz
    expect(clone).not.toBe(n);

    const n2 = new StringName("foo.bar.baz");
    const clone2 = n2.clone();
    expect(clone2.asDataString()).toBe(n2.asDataString());
    expect(clone2.isEqual(n2)).toBe(true);
    expect(clone2).not.toBe(n2);
  });

  it("modifying clone does not affect original", () => {
    const n = new StringArrayName(["a", "b"]);
    const c = n.clone();
    c.setComponent(1, "changed");
    expect(n.asString()).toBe("a.b");
    expect(c.asString()).toBe("a.changed");

    const n2 = new StringName("a.b");
    const c2 = n2.clone();
    c2.setComponent(1, "changed");
    expect(n2.asString()).toBe("a.b");
    expect(c2.asString()).toBe("a.changed");
  });
});

// ------------------------------------------------------------

describe("isEqual()", () => {
  it("returns true for names with identical structure", () => {
    const n1 = new StringArrayName(["api", "v1"]);
    const n2 = new StringArrayName(["api", "v1"]);
    expect(n1.isEqual(n2)).toBe(true);

    const s1 = new StringName("api.v1");
    const s2 = new StringName("api.v1");
    expect(s1.isEqual(s2)).toBe(true);
  });

  it("returns false for names differing in components or delimiter", () => {
    const n1 = new StringArrayName(["api", "v1"]);
    const n2 = new StringArrayName(["api", "v2"]);
    expect(n1.isEqual(n2)).toBe(false);

    const n3 = new StringArrayName(["api", "v1"], "/");
    expect(n1.isEqual(n3)).toBe(false);

    const s1 = new StringName("api.v1");
    const s2 = new StringName("api.v2");
    expect(s1.isEqual(s2)).toBe(false);
  });
});

// ------------------------------------------------------------

describe("getHashCode()", () => {
  it("produces same hash for equal names", () => {
    const n1 = new StringArrayName(["env", "prod"]);
    const n2 = new StringArrayName(["env", "prod"]);
    expect(n1.getHashCode()).toBe(n2.getHashCode());

    const s1 = new StringName("env.prod");
    const s2 = new StringName("env.prod");
    expect(s1.getHashCode()).toBe(s2.getHashCode());
  });

  it("produces different hash for unequal names", () => {
    const n1 = new StringArrayName(["env", "prod"]);
    const n2 = new StringArrayName(["env", "dev"]);
    expect(n1.getHashCode()).not.toBe(n2.getHashCode());

    const s1 = new StringName("env.prod");
    const s2 = new StringName("env.dev");
    expect(s1.getHashCode()).not.toBe(s2.getHashCode());
  });

  it("is consistent across multiple calls", () => {
    const n = new StringArrayName(["foo", "bar"]);
    const first = n.getHashCode();
    const second = n.getHashCode();
    expect(first).toBe(second);

    const s = new StringName("foo.bar");
    expect(s.getHashCode()).toBe(s.getHashCode());
  });
});


