export const DEFAULT_DELIMITER: string = '.';
// ! Das hier ist nur ein \
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    //! info: saves escaped componentes
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    constructor(other: string[], delimiter?: string) {
        this.assertValidDelimiter(delimiter);
        this.assertValidComponentsArray(other);

        if (delimiter) this.delimiter = delimiter;

        for (let component of other) {
            if(component.includes(this.delimiter) || component.includes(ESCAPE_CHARACTER)) {
                component = this.asEscapedComponent(component);
            }
            this.components.push(component);
        }
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    // @methodtype conversion-method
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

    /** 
     * Returns a machine-readable representation of Name instance using default control characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The control characters in the data string are the default characters
     */
    // @methodtype conversion-method
    public asDataString(): string {
        let result = '';
        for (let i = 0; i < this.components.length; i++) {
            result = result + this.components[i];
            if (i < this.components.length - 1) {
                result = result + ESCAPE_CHARACTER + DEFAULT_DELIMITER;
            }
        }
        return result;
    }

    // @methodtype set-method
    public getComponent(i: number): string {
        this.assertIndexInRange(i);
        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        this.assertIndexInRange(i);
        this.components.splice(i, 1, this.asEscapedComponent(c));
    }

     /** Returns number of components in Name instance */
     // @methodtype get-method
     public getNoComponents(): number {
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype command-method
    public insert(i: number, c: string): void {
        this.assertIndexInRange(i, true);
        this.components.splice(i, 0, this.asEscapedComponent(c));
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype command-method
    public append(c: string): void {
        this.components.push(this.asEscapedComponent(c));
    }

    // @methodtype command-method
    public remove(i: number): void {
        this.assertIndexInRange(i);
        this.components.splice(i, 1);
    }

    // @methodtype conversion-method
    private asEscapedComponent(component: string): string {
        let result = '';
        for (let ch of component) {
            if (ch.includes(this.delimiter) || ch.includes(ESCAPE_CHARACTER)) {
                ch = ESCAPE_CHARACTER + ch;
            }
            result = result.concat(ch);
        }
        return result;
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
}