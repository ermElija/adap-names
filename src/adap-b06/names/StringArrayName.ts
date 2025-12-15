import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

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

    /* public clone(): Name {
        const components = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        return new StringArrayName(components, this.getDelimiterCharacter());
    } */

    /* public asString(delimiter: string = this.delimiter): string {
        this.assertValidDelimiter(delimiter);
        return this.components
            .map(c => this.unescape(c))
            .join(delimiter);
    } */

    public toString(): string {
        return this.components
            .map(c => this.unescape(c))
            .join(this.delimiter);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIndexInRange(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string): Name {
        this.assertIndexInRange(i);
        this.assertProperlyMasked(c);
        //this.components[i] = c;
        const comp = [... this.components];
        comp[i] = c;
        return new StringArrayName(comp, this.delimiter);
    }

    public insert(i: number, c: string): Name {
        this.assertIndexInRange(i, true);
        this.assertProperlyMasked(c);
        //this.components.splice(i, 0, c);
        const comp = [... this.components];
        comp.splice(i, 0, c);
        return new StringArrayName(comp, this.delimiter);
    }

    public append(c: string): Name {
        this.assertProperlyMasked(c);
        //this.components.push(c);
        const comp = [... this.components];
        comp.push(c);
        return new StringArrayName(comp, this.delimiter);
    }

    public remove(i: number): Name {
        this.assertIndexInRange(i);
        //this.components.splice(i, 1);
        const comp = [... this.components];
        comp.splice(i, 1);
        return new StringArrayName(comp, this.delimiter);
    }

    public concat(other: Name): Name {
        const comp = [... this.components];
        for (let i = 0; i < other.getNoComponents(); i++) {
            comp.push(other.getComponent(i));
        }
        return new StringArrayName(comp, this.delimiter);
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