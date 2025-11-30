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

    public setComponent(i: number, c: string) {
        this.assertIndexInRange_Pre(i);
        this.assertProperlyMasked_Pre(c);

        const oldCount = this.getNoComponents();
        const oldCopy = [...this.components];

        this.components[i] = c;

        this.assertSetComponent_CorrectComponent_Post(i, c);
        this.assertSetComponent_ComponentCountUnchanged_Post(oldCount);
        this.assertSetComponent_OtherComponentsUnchanged_Post(i, oldCopy);

        this.assertInvariant();
    }

    public insert(i: number, c: string) {
        this.assertIndexInRange_Pre(i, true);
        this.assertProperlyMasked_Pre(c);

        const oldCount = this.getNoComponents();
        const oldCopy = [...this.components];

        this.components.splice(i, 0, c);

        this.assertInsert_CorrectInserted_Post(i, c);
        this.assertInsert_CountIncreased_Post(oldCount);
        this.assertInsert_OtherComponentsShifted_Post(i, oldCopy);

        this.assertInvariant();
    }

    public append(c: string) {
        this.assertProperlyMasked_Pre(c);

        const oldCount = this.getNoComponents();
        const oldCopy = [...this.components];

        this.components.push(c);

        this.assertAppend_CountIncreased_Post(oldCount);
        this.assertAppend_LastComponentCorrect_Post(c);
        this.assertAppend_OtherComponentsUnchanged_Post(oldCopy);

        this.assertInvariant();
    }

    public remove(i: number) {
        this.assertIndexInRange_Pre(i);

        const oldCount = this.getNoComponents();
        const oldCopy = [...this.components];

        this.components.splice(i, 1);

        this.assertRemove_CountDecreased_Post(oldCount);
        this.assertRemove_CorrectComponentRemoved_Post(i, oldCopy);
        this.assertRemove_OtherComponentsShifted_Post(i, oldCopy);

        this.assertInvariant();
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

    protected assertIndexInRange_Pre(i: number, isEndAllowed: boolean = false) {
        this.assertIndexInRange(i, isEndAllowed);
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

    protected assertProperlyMasked_Pre(component: string) {
        this.assertProperlyMasked(component);
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

    protected assertSetComponent_CorrectComponent_Post(i: number, c: string): void {
        if (this.components[i] !== c) {
            throw new MethodFailedException("setComponent(): component not correctly updated");
        }
    }

    protected assertSetComponent_ComponentCountUnchanged_Post(oldCount: number): void {
        if (this.getNoComponents() !== oldCount) {
            throw new MethodFailedException("setComponent(): component count changed unexpectedly");
        }
    }

    protected assertSetComponent_OtherComponentsUnchanged_Post(
        i: number,
        oldComponents: string[]
    ): void {
        for (let idx = 0; idx < this.components.length; idx++) {
            if (idx === i) continue;
            if (this.components[idx] !== oldComponents[idx]) {
                throw new MethodFailedException(
                    `setComponent(): component at index ${idx} was modified unexpectedly`
                );
            }
        }
    }

    protected assertInsert_CorrectInserted_Post(i: number, c: string): void {
        if (this.components[i] !== c) {
            throw new MethodFailedException("insert(): component not inserted at correct index");
        }
    }

    protected assertInsert_CountIncreased_Post(oldCount: number): void {
        if (this.getNoComponents() !== oldCount + 1) {
            throw new MethodFailedException("insert(): component count not increased by 1");
        }
    }

    protected assertInsert_OtherComponentsShifted_Post(
        i: number,
        oldComponents: string[]
    ): void {
        for (let idx = 0; idx < oldComponents.length; idx++) {
            const newIndex = idx < i ? idx : idx + 1;
            if (this.components[newIndex] !== oldComponents[idx]) {
                throw new MethodFailedException("insert(): surrounding components corrupted");
            }
        }
    }

    protected assertAppend_CountIncreased_Post(oldCount: number): void {
        if (this.getNoComponents() !== oldCount + 1) {
            throw new MethodFailedException("append(): component count not increased by 1");
        }
    }

    protected assertAppend_LastComponentCorrect_Post(c: string): void {
        if (this.components[this.components.length - 1] !== c) {
            throw new MethodFailedException("append(): component appended incorrectly");
        }
    }

    protected assertAppend_OtherComponentsUnchanged_Post(oldComponents: string[]): void {
        for (let i = 0; i < oldComponents.length; i++) {
            if (this.components[i] !== oldComponents[i]) {
                throw new MethodFailedException("append(): existing components altered unexpectedly");
            }
        }
    }

    protected assertRemove_CountDecreased_Post(oldCount: number): void {
        if (this.getNoComponents() !== oldCount - 1) {
            throw new MethodFailedException("remove(): component count not decreased by 1");
        }
    }

    protected assertRemove_CorrectComponentRemoved_Post(i: number, oldComponents: string[]): void {
        if (this.components[i] === oldComponents[i]) {
            throw new MethodFailedException("remove(): component not removed");
        }
    }

    protected assertRemove_OtherComponentsShifted_Post(
        i: number,
        oldComponents: string[]
    ): void {
        for (let oldIndex = 0; oldIndex < oldComponents.length; oldIndex++) {
            if (oldIndex === i) continue;
            const newIndex = oldIndex < i ? oldIndex : oldIndex - 1;

            if (this.components[newIndex] !== oldComponents[oldIndex]) {
                throw new MethodFailedException("remove(): components shifted incorrectly");
            }
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