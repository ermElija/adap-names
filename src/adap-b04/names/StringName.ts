import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);
        this.assertConstructor_SourceNotEmpty_Pre(source);
        this.assertConstructor_DelimiterValid_Pre(delimiter);

        this.assertMaskedString(source);
        this.name = source;

        this.noComponents = this.countComponents(source, this.delimiter);

        this.assertConstructor_ComponentCountCorrect_Post(source);
        this.assertConstructor_NameSetCorrectly_Post(source);
        this.assertInvariant();
    }

    public clone(): Name {
        const clone = new StringName(this.name, this.getDelimiterCharacter());

        this.assertClone_Equal_Post(clone);
        this.assertClone_NotSame_Post(clone);
        this.assertClone_RepresentationIndependent_Post(clone as StringName);
        this.assertClone_DelimiterCorrect_Post(clone);

        // INVARIANT für beide Objekte prüfen
        this.assertInvariant();
        (clone as any).assertInvariant();

        return clone;
    }

    public asString(delimiter: string = this.delimiter): string {
        this.assertValidDelimiter_Pre(delimiter);

        const comps = this.splitIntoComponents(this.name, this.delimiter)
            .map(c => this.unescape(c));

        const result = comps.join(delimiter);

        this.assertAsString_NotNull_Post(result);
        this.assertAsString_ComponentCountCorrect_Post(result, delimiter);
        this.assertAsString_UnescapedCorrect_Post(result, delimiter);
        this.assertInvariant();
        return result;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        const comps = this.splitIntoComponents(this.name, this.delimiter);
        this.assertIndexInRange(i, comps.length);
        return comps[i];
    }

    public setComponent(i: number, c: string) {
        this.assertIndexInRange_Pre(i);
        this.assertProperlyMasked_Pre(c);

        const oldCount = this.noComponents;
        const oldComponents = this.splitIntoComponents(this.name, this.delimiter);

        const comps = this.splitIntoComponents(this.name, this.delimiter);
        this.assertIndexInRange(i, comps.length);
        this.assertProperlyMasked(c);

        comps[i] = c;
        this.name = comps.join(this.delimiter);
        this.noComponents = comps.length;

        this.assertSetComponent_CountUnchanged_Post(oldCount);
        this.assertSetComponent_Correct_Post(i, c);
        this.assertSetComponent_OthersUnchanged_Post(i, oldComponents);
        this.assertInvariant();
    }

    public insert(i: number, c: string) {
        this.assertInsert_Index_Pre(i);
        this.assertInsert_ComponentMasked_Pre(c);

        const oldCount = this.noComponents;
        const oldComponents = this.splitIntoComponents(this.name, this.delimiter);

        const comps = this.splitIntoComponents(this.name, this.delimiter);
        this.assertIndexInRange(i, comps.length + 1);
        this.assertProperlyMasked(c);

        comps.splice(i, 0, c);
        this.name = comps.join(this.delimiter);
        this.noComponents = comps.length;

        this.assertInsert_CountIncreased_Post(oldCount);
        this.assertInsert_CorrectComponentInserted_Post(i, c);
        this.assertInsert_OtherComponentsShifted_Post(i, oldComponents);
        this.assertInvariant();
    }

    public append(c: string) {
        this.assertAppend_ComponentMasked_Pre(c);

        const oldCount = this.noComponents;
        const oldComponents = this.splitIntoComponents(this.name, this.delimiter);
        this.assertProperlyMasked(c);

        if (this.noComponents === 0) {
            this.name = c;
        } else {
            this.name = this.name + this.delimiter + c;
        }

        this.noComponents++;

        this.assertAppend_CountIncreased_Post(oldCount);
        this.assertAppend_LastComponentCorrect_Post(c);
        this.assertAppend_OtherComponentsUnchanged_Post(oldComponents);
        this.assertInvariant();
    }

    public remove(i: number) {
        this.assertRemove_Index_Pre(i);

        const oldCount = this.noComponents;
        const oldComponents = this.splitIntoComponents(this.name, this.delimiter);

        const comps = this.splitIntoComponents(this.name, this.delimiter);
        this.assertIndexInRange(i, comps.length);

        comps.splice(i, 1);
        this.name = comps.join(this.delimiter);
        this.noComponents = comps.length;

        this.assertRemove_CountDecreased_Post(oldCount);
        this.assertRemove_RemovedCorrectComponent_Post(i, oldComponents);
        this.assertRemove_NoUnexpectedModification_Post(i, oldComponents);
        this.assertInvariant();
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

    // @methodtype conversion-method
protected asUnEscapedComponent(component: string): string {
    let result = "";
    let skip = false;

    for (let ch of component) {
        if (skip) {
            skip = false;
            result = result.concat(ch);
            continue;
        }

        if (ch === ESCAPE_CHARACTER) {
            skip = true;
            continue;
        }

        result = result.concat(ch);
    }
    return result;
}


    protected assertValidDelimiter_Pre(delimiter: string): void {
    if (delimiter === null || delimiter === undefined) {
        throw new IllegalArgumentException("Delimiter must not be null or undefined");
    }
    if (delimiter.trim() === "") {
        throw new IllegalArgumentException("Delimiter must not be empty or whitespace");
    }
    if (/[a-zA-Z]/.test(delimiter)) {
        throw new IllegalArgumentException("Delimiter must not be an alphabetic character");
    }
}

protected assertIndexInRange_Pre(i: number, isEndAllowed: boolean = false): void {
    const components = this.splitIntoComponents(this.name, this.delimiter);
    const length = isEndAllowed ? components.length : components.length - 1;

    this.assertIndexInRange(i, length); // ← korrigiert den Fehler
}


protected assertProperlyMasked_Pre(c: string): void {
    if (c === null || c === undefined) {
        throw new IllegalArgumentException("Component must not be null or undefined");
    }

    try {
        this.assertProperlyMasked(c); // primitive method
    } catch (e) {
        throw new IllegalArgumentException(
            `Component "${c}" is not properly masked`
        );
    }
}

    protected assertInsert_Index_Pre(i: number): void {
    const comps = this.splitIntoComponents(this.name, this.delimiter);
    this.assertIndexInRange(i, comps.length + 1);
}


    protected assertAppend_ComponentMasked_Pre(c: string): void {
        this.assertProperlyMasked(c);
    }

    protected assertRemove_Index_Pre(i: number): void {
    const comps = this.splitIntoComponents(this.name, this.delimiter);
    this.assertIndexInRange(i, comps.length);
}
    protected assertInsert_ComponentMasked_Pre(c: string): void {
        this.assertProperlyMasked(c);
    }

    protected assertInvariant(): void {

        // internal string must exist
        if (this.name === null || this.name === undefined) {
            throw new InvalidStateException("name must not be null or undefined");
        }

        // delimiter must exist and be valid
        if (this.delimiter === null || this.delimiter === undefined) {
            throw new InvalidStateException("delimiter must not be null or undefined");
        }
        this.assertValidDelimiter(this.delimiter);

        // component count must match noComponents
        const components = this.splitIntoComponents(this.name, this.delimiter);

        if (components.length !== this.noComponents) {
            throw new InvalidStateException("component count mismatch");
        }

        // each component must be masked properly
        for (const comp of components) {
            this.assertProperlyMasked(comp);
        }
    }

    protected assertConstructor_SourceNotEmpty_Pre(source: string): void {
        if (!source || source.length === 0) {
            throw new IllegalArgumentException("Input name must not be empty");
        }
    }

    protected assertConstructor_DelimiterValid_Pre(delimiter?: string): void {
        if (delimiter !== undefined) {
            this.assertValidDelimiter(delimiter); // wirft IllegalArgumentException
        }
    }

    protected assertConstructor_ComponentCountCorrect_Post(source: string): void {
        const components = this.splitIntoComponents(source, this.delimiter);
        if (components.length !== this.noComponents) {
            throw new MethodFailedException("Constructor: component count incorrect");
        }
    }

    protected assertConstructor_NameSetCorrectly_Post(source: string): void {
        if (this.name !== source) {
            throw new MethodFailedException("Constructor: internal name not stored correctly");
        }
    }

    protected assertAsString_NotNull_Post(result: string): void {
        if (!result) {
            throw new MethodFailedException("asString() must not return null or empty");
        }
    }

    protected assertAsString_ComponentCountCorrect_Post(result: string, delimiter: string): void {
        const count = result.split(delimiter).length;
        if (count !== this.noComponents) {
            throw new MethodFailedException("asString() component count mismatch");
        }
    }

    protected assertAsString_UnescapedCorrect_Post(result: string, delimiter: string): void {
        const expected = this.splitIntoComponents(this.name, this.delimiter)
            .map(c => this.asUnEscapedComponent(c));
        const actual = result.split(delimiter);
        for (let i = 0; i < expected.length; i++) {
            if (expected[i] !== actual[i]) {
                throw new MethodFailedException("asString(): unescape error at component " + i);
            }
        }
    }

    protected assertSetComponent_CountUnchanged_Post(oldCount: number): void {
        if (this.noComponents !== oldCount) {
            throw new MethodFailedException("setComponent(): component count changed");
        }
    }

    protected assertSetComponent_Correct_Post(i: number, c: string): void {
        const comps = this.splitIntoComponents(this.name, this.delimiter);
        if (comps[i] !== c) {
            throw new MethodFailedException("setComponent(): wrong component set");
        }
    }

    protected assertSetComponent_OthersUnchanged_Post(
        i: number, oldComponents: string[]
    ): void {
        const comps = this.splitIntoComponents(this.name, this.delimiter);
        for (let idx = 0; idx < comps.length; idx++) {
            if (idx === i) continue;
            if (comps[idx] !== oldComponents[idx]) {
                throw new MethodFailedException("setComponent(): other component modified");
            }
        }
    }

    protected assertInsert_CountIncreased_Post(oldCount: number): void {
        if (this.noComponents !== oldCount + 1) {
            throw new MethodFailedException("insert(): component count not increased by 1");
        }
    }

    protected assertInsert_CorrectComponentInserted_Post(n: number, c: string): void {
        const comps = this.splitIntoComponents(this.name, this.delimiter);
        if (comps[n] !== c) {
            throw new MethodFailedException("insert(): component not inserted at correct index");
        }
    }

    protected assertInsert_OtherComponentsShifted_Post(
        n: number,
        oldComponents: string[]
    ): void {

        const newComps = this.splitIntoComponents(this.name, this.delimiter);

        for (let oldIndex = 0; oldIndex < oldComponents.length; oldIndex++) {
            const newIndex = oldIndex < n ? oldIndex : oldIndex + 1;

            if (newComps[newIndex] !== oldComponents[oldIndex]) {
                throw new MethodFailedException(
                    `insert(): component shift incorrect at oldIndex=${oldIndex}`
                );
            }
        }
    }

    protected assertAppend_CountIncreased_Post(oldCount: number): void {
        if (this.noComponents !== oldCount + 1) {
            throw new MethodFailedException("append(): component count not increased by 1");
        }
    }

    protected assertAppend_LastComponentCorrect_Post(c: string): void {
        const comps = this.splitIntoComponents(this.name, this.delimiter);
        if (comps[comps.length - 1] !== c) {
            throw new MethodFailedException("append(): last component is incorrect");
        }
    }

    protected assertAppend_OtherComponentsUnchanged_Post(oldComponents: string[]): void {
        const comps = this.splitIntoComponents(this.name, this.delimiter);

        for (let i = 0; i < oldComponents.length; i++) {
            if (comps[i] !== oldComponents[i]) {
                throw new MethodFailedException(
                    `append(): component at index ${i} was modified unexpectedly`
                );
            }
        }
    }

    protected assertRemove_CountDecreased_Post(oldCount: number): void {
        if (this.noComponents !== oldCount - 1) {
            throw new MethodFailedException("remove(): component count not decreased by 1");
        }
    }

    protected assertRemove_RemovedCorrectComponent_Post(
        n: number,
        oldComponents: string[]
    ): void {
        const comps = this.splitIntoComponents(this.name, this.delimiter);

        for (let oldIndex = 0; oldIndex < oldComponents.length; oldIndex++) {
            if (oldIndex === n) continue; // removed component

            const newIndex = oldIndex < n ? oldIndex : oldIndex - 1;

            if (comps[newIndex] !== oldComponents[oldIndex]) {
                throw new MethodFailedException(
                    `remove(): incorrect component shift at index ${oldIndex}`
                );
            }
        }
    }

    protected assertRemove_NoUnexpectedModification_Post(
        n: number,
        oldComponents: string[]
    ): void {
        const comps = this.splitIntoComponents(this.name, this.delimiter);

        // check all except removed index
        for (let oldIndex = 0; oldIndex < oldComponents.length; oldIndex++) {
            if (oldIndex === n) continue;

            const newIndex = oldIndex < n ? oldIndex : oldIndex - 1;

            if (comps[newIndex] !== oldComponents[oldIndex]) {
                throw new MethodFailedException(
                    `remove(): component ${oldIndex}.modified unexpectedly`
                );
            }
        }
    }

    protected assertClone_Equal_Post(clone: Name): void {
    if (clone.asDataString() !== this.asDataString()) {
        throw new MethodFailedException("clone(): data string mismatch");
    }
    if (clone.getDelimiterCharacter() !== this.getDelimiterCharacter()) {
        throw new MethodFailedException("clone(): delimiter mismatch");
    }
}


    protected assertClone_NotSame_Post(clone: Name): void {
        if (clone === this) {
            throw new MethodFailedException("clone(): cloned object must not be same reference");
        }
    }

    protected assertClone_RepresentationIndependent_Post(clone: StringName): void {
        if (clone.asDataString() !== this.asDataString()) {
            throw new MethodFailedException("clone(): internal data string mismatch");
        }
        if (clone.asDataString() === this.asDataString() && clone === this) {
            throw new MethodFailedException("clone(): no deep copy created");
        }
    }

    protected assertClone_DelimiterCorrect_Post(clone: Name): void {
        if (clone.getDelimiterCharacter() !== this.getDelimiterCharacter()) {
            throw new MethodFailedException("clone(): delimiter mismatch between clone and original");
        }
    }
}