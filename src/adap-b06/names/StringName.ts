import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);
        this.assertNameString(source);
        this.assertValidDelimiter(delimiter);

        this.assertMaskedString(source);
        this.name = source;

        this.noComponents = this.countComponents(source, this.delimiter);
    }

    /* public clone(): Name {
        return new StringName(this.name, this.getDelimiterCharacter());
    } */

    /* public asString(delimiter: string = this.delimiter): string {
        this.assertValidDelimiter(delimiter);

        const comps = this.splitIntoComponents(this.name, this.delimiter)
            .map(c => this.unescape(c));

        return comps.join(delimiter);
    } */

    public toString(): string {
        const comps = this.splitIntoComponents(this.name, this.delimiter)
            .map(c => this.unescape(c));

        return comps.join(this.delimiter);
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        const comps = this.splitIntoComponents(this.name, this.delimiter);
        this.assertIndexInRange(i, comps.length);
        return comps[i];
    }

    public setComponent(i: number, c: string): Name {
        const comps = this.splitIntoComponents(this.name, this.delimiter);
        this.assertIndexInRange(i, comps.length);
        this.assertProperlyMasked(c);

        comps[i] = c;
        //this.name = comps.join(this.delimiter);
        const updatedName = comps.join(this.delimiter);
        //this.noComponents = comps.length;
        return new StringName(updatedName, this.delimiter);
    }

    public insert(i: number, c: string): Name {
        const comps = this.splitIntoComponents(this.name, this.delimiter);
        this.assertIndexInRange(i, comps.length + 1);
        this.assertProperlyMasked(c);

        comps.splice(i, 0, c);
        //this.name = comps.join(this.delimiter);
        //this.noComponents = comps.length;
        return new StringName(comps.join(this.delimiter));
    }

    public append(c: string): Name {
        this.assertProperlyMasked(c);

        if (this.noComponents === 0) {
            //this.name = c;
            return new StringName(c, this.delimiter);
        } else {
            //this.name = this.name + this.delimiter + c;
            return new StringName(this.name + this.delimiter + c, this.delimiter);
        }

        //this.noComponents++;
    }

    public remove(i: number): Name {
        const comps = this.splitIntoComponents(this.name, this.delimiter);
        this.assertIndexInRange(i, comps.length);

        comps.splice(i, 1);
        //this.name = comps.join(this.delimiter);
        //this.noComponents = comps.length;
        return new StringName(comps.join(this.delimiter), this.delimiter);
    }

    public concat(other: Name): Name {
        return new StringName(this.toString() + this.delimiter + other.toString(), this.delimiter);
    }

    private countComponents(source: string, delimiter: string): number {
        return this.splitIntoComponents(source, delimiter).length;
    }

    private splitIntoComponents(str: string, delimiter: string): string[] {
        const result: string[] = [];
        let current = "";
        let skip = false;

        for (let i = 0; i < str.length; i++) {
            const ch = str[i];

            if (skip) {
                current += ch;
                skip = false;
            } else if (ch === ESCAPE_CHARACTER) {
                skip = true;
                current += ch;  // keep the escape
            } else if (ch === delimiter) {
                result.push(current);
                current = "";
            } else {
                current += ch;
            }
        }
        result.push(current);
        return result;
    }

    private unescape(c: string): string {
        let result = "";
        let skip = false;

        for (const ch of c) {
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

    private assertMaskedString(str: string) {
        const comps = this.splitIntoComponents(str, this.delimiter);
        for (const c of comps) this.assertProperlyMasked(c);
    }

    private assertProperlyMasked(component: string): void {
        for (let i = 0; i < component.length; i++) {
            const ch = component[i];

            if (ch === this.delimiter && component[i - 1] !== ESCAPE_CHARACTER) {
                throw new Error(`Component "${component}" not masked`);
            }

            if (ch === ESCAPE_CHARACTER && component[i + 1] === undefined) {
                throw new Error("Trailing escape not allowed");
            }
        }
    }

    private assertIndexInRange(i: number, length: number): void {
        if (i < 0 || i >= length)
            throw new Error("index out of bounds");
    }

    private assertValidDelimiter(delimiter?: string) {
        if (!delimiter) return;
        if (delimiter.trim() === "") throw new Error("Delimiter empty");
        if (/[a-zA-Z]/.test(delimiter)) throw new Error("Delimiter alphabetic");
    }

    private assertNameString(name: string) {
        if (name === undefined || name.length === 0)
            throw new Error("Input name is undefined or empty");
    }

}