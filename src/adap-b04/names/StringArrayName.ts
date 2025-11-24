import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

/*
    Preconditions: Eingabeparameter
    Postcondition: Wurde Dienstleistung korrekt ausgeführt?
    Class invariant: Object has still valid state
*/

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);
        this.assertValidDelimiter(delimiter);

        // store fully masked components
        for (const c of source) {
            this.assertProperlyMasked(c);
            this.components.push(c);
        }
    }

    public clone(): Name {
        const components = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        const result = new StringArrayName(components, this.getDelimiterCharacter());
        this.assertEqualAfterClone_Post(result);
        this.assertNotSameAfterClone_Post(result);
        this.assertInvariant();
        return result;
    }

    public asString(delimiter: string = this.delimiter): string {
        this.assertValidDelemiterInput_Pre(delimiter);
        const result = this.components
            .map(c => this.unescape(c))
            .join(delimiter);

        this.assertAsString_NotNullOrUndefined_Post(result);
        this.assertAsString_CorrectComponentCount_Post(result, delimiter);
        this.assertAsString_ComponentsMatch_Post(result, delimiter);
        this.assertInvariant();
        return result;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIndexInRange(i);
        return this.components[i];
    }

    // todo
    public setComponent(i: number, c: string) {
        this.assertIndexInRange(i);
        this.assertProperlyMasked(c);
        this.components[i] = c;
    }

    // todo
    public insert(i: number, c: string) {
        this.assertIndexInRange(i, true);
        this.assertProperlyMasked(c);
        this.components.splice(i, 0, c);
    }

    // todo
    public append(c: string) {
        this.assertProperlyMasked(c);
        this.components.push(c);
    }

    // todo
    public remove(i: number) {
        this.assertIndexInRange(i);
        this.components.splice(i, 1);
    }

    private unescape(component: string): string {
        let result = "";
        let skip = false;
        for (const ch of component) {
            if (skip) {
                result += ch;
                skip = false;
            } else if (ch === ESCAPE_CHARACTER) {
                skip = true;
            } else {
                result += ch;
            }
        }
        return result;
    }

    private assertIndexInRange(i: number, isEndAllowed: boolean = false): void {
        const max = this.components.length + (isEndAllowed ? 1 : 0);
        if (i < 0 || i >= max)
            throw new Error("index out of bounds");
    }

    private assertValidDelimiter(delimiter?: string) {
        if (!delimiter) return;
        if (delimiter.trim() === "") throw new InvalidStateException("Delimiter must not be empty");
        if (/[a-zA-Z]/.test(delimiter)) throw new InvalidStateException("Delimiter must not be alphabetic");
    }

    private assertProperlyMasked(component: string): void {
        for (let i = 0; i < component.length; i++) {
            const ch = component[i];

            // unescaped delimiter
            if (ch === this.delimiter && component[i - 1] !== ESCAPE_CHARACTER) {
                throw new InvalidStateException(`Component "${component}" is not properly masked`);
            }

            // escaped escape must be "\\" (double)
            if (ch === ESCAPE_CHARACTER && component[i + 1] === undefined) {
                throw new InvalidStateException("Escape at end not allowed");
            }
        }
    }

    protected assertInvariant() {
        if (this.components === null || this.components === undefined) {
            throw new InvalidStateException("components must not be null or undefined");
        }
        this.assertValidDelimiter(this.delimiter);
        for (const c of this.components) {
            if (c === null || c === undefined) {
                throw new InvalidStateException("component must not be null or undefined");
            }
            this.assertProperlyMasked(c);
        }
        if (this.components.length !== this.getNoComponents()) {
            throw new InvalidStateException("component count mismatch");
        }
    }

    protected assertEqualAfterClone_Post(clone: Name) {
        if (!clone.isEqual(this)) {
            throw new MethodFailedException("Not equal after cloned")
        }
    }

    protected assertNotSameAfterClone_Post(clone: Name): void {
        if (clone === this) {
            throw new MethodFailedException("Cloned object must not be the same instance");
        }
    }

    protected assertValidDelemiterInput_Pre(delimiter: string) {
        this.assertValidDelimiter(delimiter);
    }

    protected assertAsString_NotNullOrUndefined_Post(result: string): void {
        if (result === null || result === undefined) {
            throw new MethodFailedException("asString() returned null or undefined");
        }
    }

    protected assertAsString_CorrectComponentCount_Post(result: string, delimiter: string): void {
        const componentsFromResult = result.split(delimiter);
        if (componentsFromResult.length !== this.getNoComponents()) {
            throw new MethodFailedException("asString() produced wrong number of components");
        }
    }

    protected assertAsString_ComponentsMatch_Post(result: string, delimiter: string): void {
        const componentsFromResult = result.split(delimiter);
        for (let i = 0; i < this.components.length; i++) {
            const expected = this.unescape(this.components[i]);
            const actual = componentsFromResult[i];
            if (expected !== actual) {
                throw new MethodFailedException("component mismatch in asString()");
            }
        }
    }
}