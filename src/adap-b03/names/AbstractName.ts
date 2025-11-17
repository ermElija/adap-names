import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public abstract clone(): Name;

    public abstract asString(delimiter: string): string;

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        let result = this.getComponent(0);
        for (let i = 1; i < this.getNoComponents(); i++) {
            result = result + this.getDelimiterCharacter() + this.getComponent(i);
        }
        return result;
    }

    public isEqual(other: Name): boolean {
        if (other.getDelimiterCharacter() !== this.getDelimiterCharacter()) return false;
        if (other.getNoComponents() !== this.getNoComponents()) return false;
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) return false;
        }
        return true;
    }

    public getHashCode(): number {
        let hashCode = 0;
        const s = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            hashCode = (hashCode << 5) - hashCode + s.charCodeAt(i);
            hashCode |= 0;
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}