import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        this.assertValidDelimiter(delimiter);
        this.assertValidComponentsArray(source);

        if (delimiter) this.delimiter = delimiter;

        for (const c of source) {
            this.assertProperlyMasked(c);
            this.components.push(c);
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        this.assertValidDelimiter(delimiter);
        let result = '';
        for (let i = 0; i < this.components.length; i++) {
            result = result + this.asUnEscapedComponent(this.components[i]);
            if (i < this.components.length - 1) {
                result = result + delimiter;
            }
        }
        return result;
    }

    public asDataString(): string {
        let result = '';
        for (let i = 0; i < this.components.length; i++) {
            result = result + this.components[i];
            if (i < this.components.length - 1) {
                result = result + DEFAULT_DELIMITER;
            }
        }
        return result;
    }

    public getDelimiterCharacter(): string {
        throw new Error("needs implementation or deletion");
    }

    public isEmpty(): boolean {
        throw new Error("needs implementation or deletion");
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIndexInRange(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertIndexInRange(i);
        this.assertProperlyMasked(c);
        this.components.splice(i, 1, c);
    }

    public insert(i: number, c: string): void {
        this.assertIndexInRange(i, true);
        this.assertProperlyMasked(c);
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.assertProperlyMasked(c);
        this.components.push(c);
    }

    public remove(i: number): void {
        this.assertIndexInRange(i);
        this.components.splice(i, 1);
    }

    // Todo
    public concat(other: Name): void {
        throw new Error("needs implementation or deletion");
    }

    // @methodtype conversion-method
    private asUnEscapedComponent(component: string): string {
        let result = '';
        let skip = false;
        for (let ch of component) {
            if (skip) {
                skip = !skip;
                result = result.concat(ch);
                continue;
            }

            if (ch.includes(ESCAPE_CHARACTER)) {
                skip = true;
                continue;
            }
            result = result.concat(ch);
        }
        return result;
    }

    // @methodtype assertion-method
    private assertIndexInRange(i: number, isEndAllowed: boolean = false): void {
        if (isEndAllowed) {
            if ((i < 0 || i >= this.components.length + 1)) throw new Error("index out of bounds");
        } else {
            if (i < 0 || i >= this.components.length) throw new Error("index out of bounds");
        }
    }

    // @methodtype assertion-method
    private assertValidDelimiter(delimiter?: string) {
        if (!delimiter) return;
        if (delimiter.trim() === '') throw new Error("Delimiter must not be empty");
        if (/[a-zA-Z]/.test(delimiter)) throw new Error("Delimiter must not be a alphabet character");
    }

    // @methodtype assertion-method
    private assertValidComponentsArray(other: string[]) {
        if (other.length === 0) throw new Error("Component array input must not be empty");
    }

    // @methodtype assertion-method
    private assertProperlyMasked(component: string): void {
        for (let i = 0; i < component.length; i++) {
            const ch = component[i];
            if (ch === this.delimiter) {
                // Wenn ein Delimiter vorkommt, muss er escaped sein
                if (i === 0 || component[i - 1] !== ESCAPE_CHARACTER) {
                    throw new Error(`Component "${component}" is not properly masked`);
                }
            }
        }
    }

}