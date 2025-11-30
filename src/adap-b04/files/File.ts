import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED
}

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);

        this.assertConstructor_StateInitialized_Post();
        this.assertInvariant();
    }

    public open(): void {
        this.assertOpen_StateClosed_Pre();

        this.state = FileState.OPEN;

        this.assertOpen_StateOpen_Post();
        this.assertInvariant();
    }

    public read(noBytes: number): Int8Array {

        this.assertRead_BytesNonNegative_Pre(noBytes);
        this.assertRead_StateOpen_Pre();

        const result = new Int8Array(noBytes);

        this.assertRead_ReturnSize_Post(result, noBytes);
        this.assertInvariant();
        return result;
    }

    public close(): void {
        this.assertClose_StateOpen_Pre();

        this.state = FileState.CLOSED;

        this.assertClose_StateClosed_Post();
        this.assertInvariant();
    }

    protected assertInvariant(): void {
        // State must be valid
        if (this.state !== FileState.OPEN &&
            this.state !== FileState.CLOSED &&
            this.state !== FileState.DELETED) {
            throw new InvalidStateException("Invalid file state");
        }

        if (this.state === FileState.DELETED) {

        }
    }

    protected assertConstructor_StateInitialized_Post(): void {
        if (this.state !== FileState.CLOSED) {
            throw new MethodFailedException("Constructor: file must start CLOSED");
        }
    }

    protected assertOpen_StateClosed_Pre(): void {
        if (this.state === FileState.OPEN) {
            throw new IllegalArgumentException("open(): file already open");
        }
        if (this.state === FileState.DELETED) {
            throw new IllegalArgumentException("open(): file is deleted");
        }
    }

    protected assertOpen_StateOpen_Post(): void {
        if (this.state !== FileState.OPEN) {
            throw new MethodFailedException("open(): state not set to OPEN");
        }
    }

    protected assertRead_StateOpen_Pre(): void {
        if (this.state !== FileState.OPEN) {
            throw new IllegalArgumentException("read(): file not open");
        }
    }

    protected assertRead_BytesNonNegative_Pre(n: number): void {
        if (n < 0) {
            throw new IllegalArgumentException("read(): noBytes must be >= 0");
        }
    }

    protected assertRead_ReturnSize_Post(data: Int8Array, expected: number): void {
        if (data.length !== expected) {
            throw new MethodFailedException("read(): returned array size is incorrect");
        }
    }

    protected assertClose_StateOpen_Pre(): void {
        if (this.state !== FileState.OPEN) {
            throw new IllegalArgumentException("close(): file is not open");
        }
    }

    protected assertClose_StateClosed_Post(): void {
        if (this.state !== FileState.CLOSED) {
            throw new MethodFailedException("close(): file not set to CLOSED");
        }
    }

    protected doGetFileState(): FileState {
        return this.state;
    }
}
