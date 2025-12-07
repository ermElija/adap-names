import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    public findNodes(bn: string): Set<Node> {
        this.assert_BaseName_Pre(bn);

        if (this.getBaseName().length === 0) {
            throw new InvalidStateException("base name must not be empty for directory");
        }

        const result = new Set<Node>();

        if (this.getBaseName() === bn) {
            result.add(this);
        }

        for (const child of this.childNodes) {
            try {
                const childResult = child.findNodes(bn);
                for (const n of childResult) {
                    result.add(n);
                }
            } catch (e) {
                throw new MethodFailedException("Child failed during findNodes()");
            }
        }

        return result;
    }
    
}