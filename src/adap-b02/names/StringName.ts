import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;
  protected name: string = "";
  protected noComponents: number = 0;

  constructor(source: string, delimiter?: string) {
    this.assertNameString(source);
    this.assertValidDelimiter(delimiter);
    if (delimiter) this.delimiter = delimiter;

    this.noComponents++;
    let skip = false;
    for (const ch of source) {
      if (skip) {
        skip = false;
        continue;
      }
      if (ch === this.delimiter) this.noComponents++;
      if (ch === ESCAPE_CHARACTER) skip = true;
    }

    this.name = source;
  }

  public asString(delimiter: string = this.delimiter): string {
    // erst die richtigen delimiter durch den mitgegebenen ersetzen
    let components = this.splitIntoComponents(this.name, this.delimiter);
    let nameWithDelimiter = "";
    for(let i = 0; i < components.length; i++) {
      if (i === components.length - 1) {
        nameWithDelimiter = nameWithDelimiter.concat(components[i]);
      } else {
        nameWithDelimiter = nameWithDelimiter.concat(components[i] + delimiter);
      }
    }
    return this.asUnEscapedComponent(nameWithDelimiter);
  }

  public asDataString(): string {
    return this.name;
  }

  public getDelimiterCharacter(): string {
    return this.delimiter;
  }

  public isEmpty(): boolean {
    return this.noComponents === 0;
  }

  public getNoComponents(): number {
    return this.noComponents;
  }

  public getComponent(x: number): string {
    this.assertIndexInRange(x);
    let components = this.splitIntoComponents(this.name, this.delimiter);
    return components[x];
  }

  public setComponent(n: number, c: string): void {
    this.noComponents--;
    this.assertIndexInRange(n);
    let components = this.splitIntoComponents(this.name, this.delimiter);
    components.splice(n, 1, c);
    this.name = this.convertComponentsInNameString(components);
  }

  public insert(n: number, c: string): void {
    this.assertIndexInRange(n, true);
    this.noComponents++;
    let components = this.splitIntoComponents(this.name);
    components.splice(n, 0, c);
    this.name = this.convertComponentsInNameString(components);
  }

  public append(c: string): void {
    this.noComponents++;
    this.name = this.name + this.delimiter + c;
  }

  public remove(n: number): void {
    this.noComponents--;
    this.assertIndexInRange(n);
    let components = this.splitIntoComponents(this.name, this.delimiter);
    components.splice(n, 1);
    this.name = this.convertComponentsInNameString(components);
  }

  public concat(other: Name): void {
    this.noComponents += other.getNoComponents();
    let componentsNew = this.splitIntoComponents(other.asDataString(), other.getDelimiterCharacter());
    this.name = this.name + this.delimiter + this.convertComponentsInNameString(componentsNew);
  }

  private splitIntoComponents(name: string, delimiter: string = this.delimiter): string[] {
    let result = [];
    let component = "";
    let skip = false;
    for (const ch of name) {
      if (skip) {
        skip = false;
        component = component.concat(ch);
        continue;
      }
      if (ch === ESCAPE_CHARACTER) {
        skip = true;
        component = component.concat(ch);
        continue;
      }
      if (ch === delimiter) {
        result.push(component);
        component = component = "";
        continue;
      }
      component = component.concat(ch);
    }
    result.push(component);
    return result;
  }

  private convertComponentsInNameString(components: string[]): string {
    let result = '';
        for (let i = 0; i < components.length; i++) {
            result = result + components[i];
            if (i < components.length - 1) {
                result = result + this.delimiter;
            }
        }
        return result;
  }

  // @methodtype conversion-method
  private asUnEscapedComponent(component: string): string {
    let result = "";
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
    let components = this.splitIntoComponents(this.name, this.delimiter);
    if (isEndAllowed) {
      if (i < 0 || i >= components.length + 1)
        throw new Error("index out of bounds");
    } else {
      if (i < 0 || i >= components.length)
        throw new Error("index out of bounds");
    }
  }

  // @methodtype assertion-method
  private assertValidDelimiter(delimiter?: string) {
    if (!delimiter) return;
    if (delimiter.trim() === "") throw new Error("Delimiter must not be empty");
    if (/[a-zA-Z]/.test(delimiter))
      throw new Error("Delimiter must not be a alphabet character");
  }

  // @methodtype assertion-method
  private assertValidComponentsArray(other: string[]) {
    if (other.length === 0)
      throw new Error("Component array input must not be empty");
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

  private assertNameString(name: string) {
    if (name === undefined || name.length === 0) throw new Error('Input name is undefined or empty');
  }
}
