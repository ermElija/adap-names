import { Directory } from "./Directory";
import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode(): RootNode {
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);

        this.assertConstructor_BaseNameIsEmpty_Post();
        this.assertConstructor_ParentIsSelf_Post();

        this.assertInvariant();
    }

    protected initialize(pn: Directory): void {
        this.parentNode = this;
    }

    public getFullName(): Name {
        return new StringName("", '/');
    }

    public move(to: Directory): void {
        this.assertMove_TargetDirectory_NotNull_Pre(to);

        const oldParent = this.parentNode;

        this.assertMove_ParentUnchanged_Post(oldParent);
        this.assertInvariant();
    }

    protected doSetBaseName(bn: string): void {

    }

    protected assertInvariant(): void {
        super.assertInvariant();

        if (this.baseName !== "") {
            throw new InvalidStateException("RootNode: baseName must be empty string");
        }

        if (this.parentNode !== this) {
            throw new InvalidStateException("RootNode: parentNode must refer to itself");
        }

        if (this.childNodes.has(this)) {
            throw new InvalidStateException("RootNode: must not appear in any childNodes set");
        }
    }

    protected assertConstructor_BaseNameIsEmpty_Post(): void {
        if (this.baseName !== "") {
            throw new MethodFailedException("RootNode: constructor must enforce empty baseName");
        }
    }

    protected assertConstructor_ParentIsSelf_Post(): void {
        if (this.parentNode !== this) {
            throw new MethodFailedException("RootNode: constructor must set parentNode = this");
        }
    }

    protected assertMove_TargetDirectory_NotNull_Pre(to: Directory): void {
        if (to === null || to === undefined) {
            throw new IllegalArgumentException("RootNode.move(): target directory must not be null");
        }
    }

    protected assertMove_ParentUnchanged_Post(oldParent: Directory): void {
        if (this.parentNode !== oldParent) {
            throw new MethodFailedException("RootNode.move(): parentNode must remain unchanged");
        }
    }
}
