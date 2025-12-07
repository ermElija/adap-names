import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";
import { Node } from "./Node";

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = this;
    }

    public getFullName(): Name {
        return new StringName("", '/');
    }

    public move(to: Directory): void {
        // null operation
    }

    protected doSetBaseName(bn: string): void {
        // null operation
    }

    public findNodes(bn: string): Set<Node> {
        this.assert_BaseName_Pre(bn);

        const result = new Set<Node>();

        for (const child of this.childNodes) {
            try {
                const childResult = child.findNodes(bn);
                for (const n of childResult) {
                    result.add(n);
                }
            } catch (e) {
                throw new ServiceFailureException("Child failed during findNodes()");
            }
        }

        return result;
    }
}