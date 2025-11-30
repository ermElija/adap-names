import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.assertConstructor_BaseName_Pre(bn);
        this.assertConstructor_Parent_Pre(pn);

        this.doSetBaseName(bn);
        this.parentNode = pn;
        this.initialize(pn);

        this.assertConstructor_BaseNameSet_Post(bn);
        this.assertConstructor_ParentSet_Post(pn);
        this.assertInvariant();
    }

    protected initialize(pn: Directory): void {
        this.assertInitialize_Parent_Pre(pn);

        this.parentNode = pn;
        this.parentNode.addChildNode(this);

        this.assertInitialize_ChildRegistered_Post(pn);
        this.assertInvariant();
    }

    public move(to: Directory): void {
        this.assertMove_TargetDirectory_Pre(to);

        const oldParent = this.parentNode;

        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;

        this.assertMove_ParentUpdated_Post(to);
        this.assertMove_RemovedFromOldParent_Post(oldParent);
        this.assertMove_AddedToNewParent_Post(to);
        this.assertInvariant();
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.assertRename_BaseName_Pre(bn);

        this.doSetBaseName(bn);

        this.assertRename_BaseNameUpdated_Post(bn);
        this.assertInvariant();
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    protected assertInvariant(): void {
        // baseName darf nicht null/undefined/leer sein
        if (this.baseName === null || this.baseName === undefined) {
            throw new InvalidStateException("baseName must not be null or undefined");
        }
        if (this.baseName.length === 0) {
            throw new InvalidStateException("baseName must not be empty");
        }

        // parentNode muss existieren
        if (this.parentNode === null || this.parentNode === undefined) {
            throw new InvalidStateException("parentNode must not be null or undefined");
        }

        // parentNode muss dieses Node als Child enthalten
        if (!this.parentNode.hasChildNode(this)) {
            throw new InvalidStateException("parentNode does not contain this node as child");
        }
    }

    protected assertConstructor_BaseName_Pre(bn: string): void {
        if (bn === null || bn === undefined || bn.length === 0) {
            throw new IllegalArgumentException("baseName must not be null or empty");
        }
    }

    protected assertConstructor_Parent_Pre(pn: Directory): void {
        if (pn === null || pn === undefined) {
            throw new IllegalArgumentException("parent directory must not be null");
        }
    }

    protected assertConstructor_BaseNameSet_Post(bn: string): void {
        if (this.baseName !== bn) {
            throw new MethodFailedException("Constructor: baseName not set correctly");
        }
    }

    protected assertConstructor_ParentSet_Post(pn: Directory): void {
        if (this.parentNode !== pn && !(this instanceof Directory && this.parentNode === this)) {
            throw new MethodFailedException("Constructor: parentNode not set correctly");
        }
    }

    protected assertInitialize_Parent_Pre(pn: Directory): void {
        if (pn === null || pn === undefined) {
            throw new IllegalArgumentException("initialize(): parent must not be null");
        }
    }

    protected assertInitialize_ChildRegistered_Post(pn: Directory): void {
        if (!pn.hasChildNode(this)) {
            throw new MethodFailedException("initialize(): node not registered in parent");
        }
    }

    protected assertMove_TargetDirectory_Pre(to: Directory): void {
        if (to === null || to === undefined) {
            throw new IllegalArgumentException("move(): target directory must not be null");
        }
        if (to === this.parentNode) {
            throw new IllegalArgumentException("move(): target directory is current parent");
        }
    }

    protected assertMove_ParentUpdated_Post(to: Directory): void {
        if (this.parentNode !== to) {
            throw new MethodFailedException("move(): parentNode not updated to target");
        }
    }

    protected assertMove_RemovedFromOldParent_Post(oldParent: Directory): void {
        if (oldParent.hasChildNode(this)) {
            throw new MethodFailedException("move(): node still present in old parent");
        }
    }

    protected assertMove_AddedToNewParent_Post(to: Directory): void {
        if (!to.hasChildNode(this)) {
            throw new MethodFailedException("move(): node not added to target directory");
        }
    }

    protected assertRename_BaseName_Pre(bn: string): void {
        if (bn === null || bn === undefined || bn.length === 0) {
            throw new IllegalArgumentException("rename(): baseName must not be null or empty");
        }
    }

    protected assertRename_BaseNameUpdated_Post(bn: string): void {
        if (this.baseName !== bn) {
            throw new MethodFailedException("rename(): baseName not updated correctly");
        }
    }
}
