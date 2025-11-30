import { Node } from "./Node";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);

        this.assertConstructor_ChildNodesInitialized_Post();
        this.assertInvariant();
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {

        this.assertAddChildNode_ChildNotNull_Pre(cn);
        this.assertAddChildNode_NotAlreadyPresent_Pre(cn);
        this.assertAddChildNode_NoSelfReference_Pre(cn);

        const oldSize = this.childNodes.size;

        this.childNodes.add(cn);

        this.assertAddChildNode_SizeIncreased_Post(oldSize);
        this.assertAddChildNode_ActuallyPresent_Post(cn);
        this.assertInvariant();
    }

    public removeChildNode(cn: Node): void {

        this.assertRemoveChildNode_NotNull_Pre(cn);
        this.assertRemoveChildNode_IsPresent_Pre(cn);

        const oldSize = this.childNodes.size;

        this.childNodes.delete(cn);

        this.assertRemoveChildNode_SizeDecreased_Post(oldSize);
        this.assertRemoveChildNode_NoLongerPresent_Post(cn);
        this.assertInvariant();
    }

    protected assertInvariant(): void {
        if (this.childNodes === null || this.childNodes === undefined) {
            throw new InvalidStateException("childNodes must not be null or undefined");
        }

        for (const cn of this.childNodes) {
            if (cn === null || cn === undefined) {
                throw new InvalidStateException("childNodes contains null");
            }
        }

        if (this.childNodes.has(this)) {
            throw new InvalidStateException("Directory must not contain itself as child");
        }

        for (const cn of this.childNodes) {
            if (cn.getParentNode() !== this) {
                throw new InvalidStateException("Child node has wrong parent reference");
            }
        }

        if (this.childNodes.size !== new Set(this.childNodes).size) {
            throw new InvalidStateException("Duplicate child nodes detected");
        }
    }

    protected assertConstructor_ChildNodesInitialized_Post(): void {
        if (this.childNodes === null || this.childNodes === undefined) {
            throw new MethodFailedException("Constructor: childNodes not initialized");
        }
        if (!(this.childNodes instanceof Set)) {
            throw new MethodFailedException("Constructor: childNodes is not a Set");
        }
    }

    protected assertAddChildNode_ChildNotNull_Pre(cn: Node): void {
        if (cn === null || cn === undefined) {
            throw new IllegalArgumentException("addChildNode(): child must not be null");
        }
    }

    protected assertAddChildNode_NotAlreadyPresent_Pre(cn: Node): void {
        if (this.childNodes.has(cn)) {
            throw new IllegalArgumentException("addChildNode(): child already present");
        }
    }

    protected assertAddChildNode_NoSelfReference_Pre(cn: Node): void {
        if (cn === this) {
            throw new IllegalArgumentException("addChildNode(): may not add directory to itself");
        }
    }

    protected assertAddChildNode_SizeIncreased_Post(oldSize: number): void {
        if (this.childNodes.size !== oldSize + 1) {
            throw new MethodFailedException("addChildNode(): size did not increase by 1");
        }
    }

    protected assertAddChildNode_ActuallyPresent_Post(cn: Node): void {
        if (!this.childNodes.has(cn)) {
            throw new MethodFailedException("addChildNode(): child not found after addition");
        }
    }

    protected assertRemoveChildNode_NotNull_Pre(cn: Node): void {
        if (cn === null || cn === undefined) {
            throw new IllegalArgumentException("removeChildNode(): child must not be null");
        }
    }

    protected assertRemoveChildNode_IsPresent_Pre(cn: Node): void {
        if (!this.childNodes.has(cn)) {
            throw new IllegalArgumentException("removeChildNode(): node not present");
        }
    }

    protected assertRemoveChildNode_SizeDecreased_Post(oldSize: number): void {
        if (this.childNodes.size !== oldSize - 1) {
            throw new MethodFailedException("removeChildNode(): size did not decrease by 1");
        }
    }

    protected assertRemoveChildNode_NoLongerPresent_Post(cn: Node): void {
        if (this.childNodes.has(cn)) {
            throw new MethodFailedException("removeChildNode(): node still present after removal");
        }
    }
}
