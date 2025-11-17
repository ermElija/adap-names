import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super();
        this.assertValidDelimiter(delimiter);
        this.assertValidComponentsArray(source);

        // store fully masked components
        for (const c of source) {
            this.assertProperlyMasked(c);
            this.components.push(c);
        }
    }
    // todo
    public clone(): Name {
        throw new Error("needs implementation or deletion");
    }

    public asString(delimiter: string = this.delimiter): string {
        this.assertValidDelimiter(delimiter);
        return this.components
            .map(c => this.unescape(c))
            .join(delimiter);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIndexInRange(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertIndexInRange(i);
        this.assertProperlyMasked(c);
        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        this.assertIndexInRange(i, true);
        this.assertProperlyMasked(c);
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        this.assertProperlyMasked(c);
        this.components.push(c);
    }

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
        if (delimiter.trim() === "") throw new Error("Delimiter must not be empty");
        if (/[a-zA-Z]/.test(delimiter)) throw new Error("Delimiter must not be alphabetic");
    }

    private assertValidComponentsArray(other: string[]) {
        if (other.length === 0) throw new Error("Component array input must not be empty");
    }

    private assertProperlyMasked(component: string): void {
        for (let i = 0; i < component.length; i++) {
            const ch = component[i];

            // unescaped delimiter
            if (ch === this.delimiter && component[i - 1] !== ESCAPE_CHARACTER) {
                throw new Error(`Component "${component}" is not properly masked`);
            }

            // escaped escape must be "\\" (double)
            if (ch === ESCAPE_CHARACTER && component[i + 1] === undefined) {
                throw new Error("Escape at end not allowed");
            }
        }
    }
}