import { isSubstringOfArrayContained } from "../../utils/utils";

export const DEFAULT_DELIMITER: string = '.';
// ! Das hier ist nur ein \ !
export const ESCAPE_CHARACTER = '\\';

// Todo: Muss wirklich jedes Sonderzeichen escaped werden?
export const SPECIAL_CHARACTERS: string[] = ['!', '"', "'", '§', '%', '&', '/', '/', '(', ')', '=', '?', '`', '´', '+', '*', '#', ',', ';', '.', ':', '-', '_', '~', '<', '>', '|', '}', ']', '[', '{', '^', '°', '\\'];

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
    // * info: saves escaped componentes
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    // Todo: Was wenn als Delemiter ein normaler Buchstabe kommt? ==> Ausnahme
    constructor(other: string[], delimiter?: string) {
        /* if () */
        if (delimiter && delimiter.trim() !== '') {
            this.delimiter = delimiter;
        }

        // Todo: Handling various other-Input variations
        // ? Sicher dass alle Sonderzeichen escaped werden sollen
        if (!other || other.length === 0) throw new Error("No valid input to construct word");
        for (let component of other) {
            if(component.includes(this.delimiter) || isSubstringOfArrayContained(component, SPECIAL_CHARACTERS)) {
                component = this.ensureEscapedComponent(component);
            }
            this.components.push(component);
        }
        console.log(this.components);
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        let d = delimiter ? delimiter : this.delimiter;
        let result = '';
        for (let i = 0; i < this.components.length; i++) {
            result = result + this.ensureUnEscapedComponent(this.components[i]);
            if (i < this.components.length - 1) {
                result = result + d;
            }
        }
        return result;
    }

    /** 
     * Returns a machine-readable representation of Name instance using default control characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The control characters in the data string are the default characters
     */
    public asDataString(): string {
        throw new Error("needs implementation or deletion");
    }

    public getComponent(i: number): string {
        throw new Error("needs implementation or deletion");
    }

    /** Expects that new Name component c is properly masked */
    public setComponent(i: number, c: string): void {
        throw new Error("needs implementation or deletion");
    }

     /** Returns number of components in Name instance */
     public getNoComponents(): number {
        throw new Error("needs implementation or deletion");
    }

    /** Expects that new Name component c is properly masked */
    public insert(i: number, c: string): void {
        throw new Error("needs implementation or deletion");
    }

    /** Expects that new Name component c is properly masked */
    public append(c: string): void {
        throw new Error("needs implementation or deletion");
    }

    public remove(i: number): void {
        throw new Error("needs implementation or deletion");
    }

    private ensureEscapedComponent(component: string): string {
        let result = '';
        for (let ch of component) {
            if (ch.includes(this.delimiter) || isSubstringOfArrayContained(ch, SPECIAL_CHARACTERS)) {
                ch = ESCAPE_CHARACTER + ch;
            }
            result = result.concat(ch);
        }
        return result;
    }

    private ensureUnEscapedComponent(component: string): string {
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

    // Todo: remove
    public getInternalRepresentation() {
        return this.components;
    }
}