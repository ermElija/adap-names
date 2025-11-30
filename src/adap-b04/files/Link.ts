import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        if (tn !== undefined && tn !== null) {
            this.assertConstructor_TargetNotNull_Pre(tn);
            this.targetNode = tn;
            this.assertConstructor_TargetSet_Post(tn);
        }

        this.assertInvariant();
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        this.assertSetTargetNode_TargetNotNull_Pre(target);

        this.targetNode = target;

        this.assertSetTargetNode_TargetSet_Post(target);
        this.assertInvariant();
    }

    public getBaseName(): string {
        this.assertTargetNode_NotNull_Pre();

        const target = this.ensureTargetNode(this.targetNode);
        const result = target.getBaseName();

        this.assertGetBaseName_ResultCorrect_Post(target, result);
        this.assertInvariant();
        return result;
    }

    public rename(bn: string): void {
        this.assertRename_BaseName_Pre(bn); 
        this.assertTargetNode_NotNull_Pre();

        const target = this.ensureTargetNode(this.targetNode);

        target.rename(bn);

        this.assertRename_TargetRenamed_Post(target, bn);
        this.assertInvariant();
    }

    protected ensureTargetNode(target: Node | null): Node {
        const result: Node = this.targetNode as Node;
        return result;
    }

    protected assertInvariant(): void {
        super["assertInvariant"]?.();

        if (this.targetNode === undefined) {
            throw new InvalidStateException("Link: targetNode must not be undefined");
        }

        if (this.targetNode !== null && this.targetNode.getParentNode() === null) {
            throw new InvalidStateException("Link: target node has no parent");
        }
    }

    protected assertConstructor_TargetNotNull_Pre(tn: Node): void {
        if (tn === null || tn === undefined) {
            throw new IllegalArgumentException("Link constructor: target must not be null");
        }
    }

    protected assertConstructor_TargetSet_Post(tn: Node): void {
        if (this.targetNode !== tn) {
            throw new MethodFailedException("Link constructor: target not stored correctly");
        }
    }

    protected assertSetTargetNode_TargetNotNull_Pre(target: Node): void {
        if (target === null || target === undefined) {
            throw new IllegalArgumentException("setTargetNode(): target must not be null");
        }
    }

    protected assertSetTargetNode_TargetSet_Post(target: Node): void {
        if (this.targetNode !== target) {
            throw new MethodFailedException("setTargetNode(): target not set correctly");
        }
    }

    protected assertTargetNode_NotNull_Pre(): void {
        if (this.targetNode === null) {
            throw new IllegalArgumentException("Link has no target node");
        }
    }

    protected assertGetBaseName_ResultCorrect_Post(target: Node, result: string): void {
        if (result !== target.getBaseName()) {
            throw new MethodFailedException("getBaseName(): result does not match target's baseName");
        }
    }

    protected assertRename_TargetRenamed_Post(target: Node, newName: string): void {
        if (target.getBaseName() !== newName) {
            throw new MethodFailedException("rename(): target baseName not updated correctly");
        }
    }
}
