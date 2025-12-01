import { describe, it, expect } from "vitest";
import { Directory } from "../../../src/adap-b05/files/Directory";
import { File } from "../../../src/adap-b05/files/File";
import { Link } from "../../../src/adap-b05/files/Link";
import { RootNode } from "../../../src/adap-b05/files/RootNode";

import { IllegalArgumentException } from "../../../src/adap-b05/common/IllegalArgumentException";
import { MethodFailedException } from "../../../src/adap-b05/common/MethodFailedException";
import { ServiceFailureException } from "../../../src/adap-b05/common/ServiceFailureException";
import { BuggyFile } from "../../../src/adap-b05/files/BuggyFile";

describe("Node.findNodes()", () => {

    // ----------------------------------------------------------
    // 1. Preconditions
    // ----------------------------------------------------------
    it("throws IllegalArgumentException for empty basename", () => {
        const root = new RootNode();
        expect(() => root.findNodes("")).toThrow(IllegalArgumentException);
    });

    it("throws IllegalArgumentException for null/undefined basename", () => {
        const root = new RootNode();
        // @ts-expect-error: testing precondition
        expect(() => root.findNodes(null)).toThrow(IllegalArgumentException);
        // @ts-expect-error: testing precondition
        expect(() => root.findNodes(undefined)).toThrow(IllegalArgumentException);
    });

    // ----------------------------------------------------------
    // 2. Match the node itself
    // ----------------------------------------------------------
    it("returns a set containing only the node itself on self-match", () => {
        const root = new RootNode();     // basename is ""
        const dir = new Directory("src", root);

        const result = dir.findNodes("src");

        expect(result.size).toBe(1);
        expect(result.has(dir)).toBe(true);
    });

    // ----------------------------------------------------------
    // 3. Directory traversal
    // ----------------------------------------------------------
    it("finds all matching nodes recursively inside directories", () => {
        const root = new RootNode();

        const d1 = new Directory("src", root);
        const d2 = new Directory("src", d1);
        const f1 = new File("src", d2);

        const result = root.findNodes("src");

        expect(result.size).toBe(3);
        expect(result.has(d1)).toBe(true);
        expect(result.has(d2)).toBe(true);
        expect(result.has(f1)).toBe(true);
    });

    // ----------------------------------------------------------
    // 4. Link nodes
    // ----------------------------------------------------------
    it("includes link nodes if their own basename matches", () => {
        const root = new RootNode();
        const dir = new Directory("config", root);
        const link = new Link("config", root);

        const result = root.findNodes("config");

        expect(result.size).toBe(2);
        expect(result.has(dir)).toBe(true);
        expect(result.has(link)).toBe(true);
    });

    // ----------------------------------------------------------
    // 5. BuggyFile must escalate method failure
    // ----------------------------------------------------------
    it("throws MethodFailedException when encountering BuggyFile", () => {
        const root = new RootNode();
        const buggy = new BuggyFile("good", root);

        expect(() => root.findNodes("good")).toThrow(MethodFailedException);
    });

});
