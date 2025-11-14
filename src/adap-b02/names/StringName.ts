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

    // ? Kann ein source mit escapeten Zeichen eingegeben werden? => Denke schon
    // ? Da wo nicht escaped wurde ist ganz sicher der richtige delimiter, was escaped wurde, gehört mit zu einer einzelnen component

    // Todo needs test
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

    // ? Kann man sonst den eingabestring 1-zu-1 übernehmen?
    // => Wenn nichts escaped ist => übernehmen wir nichts escaptes
    // => Wenn etwas escaped ist => Übernhemen wir es
    // => Wir können nicht wissen
    this.name = source;
    console.log('After Constructor: ', this.name, this.delimiter, this.noComponents);
  }

  // Todo: needs tests
  public asString(delimiter: string = this.delimiter): string {
    // erst die richtigen delimiter durch den mitgegebenen ersetzen
    let components = this.splitIntoComponents(this.name, delimiter);
    let nameWithDelimiter = "";
    for(let i = 0; i < components.length; i++) {
      if (i === components.length - 1) {
        nameWithDelimiter = nameWithDelimiter.concat(components[i]);
      } else {
        nameWithDelimiter = nameWithDelimiter.concat(components[i] + delimiter);
      }
    }

    // dann als unescapt zurückgeben
    return this.asUnEscapedComponent(this.name);
  }

  // Todo needs tests
  public asDataString(): string {
    return this.name;
  }

  // Todo needs tests
  public getDelimiterCharacter(): string {
    return this.delimiter;
  }

  // Todo needs tests
  public isEmpty(): boolean {
    return this.noComponents === 0;
  }

  // Todo needs tests
  public getNoComponents(): number {
    return this.noComponents;
  }

  // Todo needs tests
  public getComponent(x: number): string {
    this.assertIndexInRange(x);
    let components = this.splitIntoComponents(this.name, this.delimiter);
    return components[x];
  }

  // Todo needs tests
  public setComponent(n: number, c: string): void {
    this.assertIndexInRange(n);
    let components = this.splitIntoComponents(this.name, this.delimiter);
    components = components.splice(n, 1, c);
    this.name = this.convertComponentsInNameString(components);
  }

  // Todo needs tests
  public insert(n: number, c: string): void {
    this.assertIndexInRange(n, true);
    this.noComponents++;
    let components = this.splitIntoComponents(this.name, this.delimiter);
    components = components.splice(n, 0, c);
    this.name = this.convertComponentsInNameString(components);
  }

  // Todo needs tests
  public append(c: string): void {
    this.noComponents++;
    this.name = this.name + this.delimiter + c;
  }

  // Todo needs tests
  public remove(n: number): void {
    this.assertIndexInRange(n);
    let components = this.splitIntoComponents(this.name, this.delimiter);
    components = components.splice(n, 1);
    this.name = this.convertComponentsInNameString(components);
  }

  // Todo needs tests
  public concat(other: Name): void {
    this.noComponents += other.getNoComponents();
    let componentsNew = this.splitIntoComponents(other.asDataString(), other.getDelimiterCharacter());
    this.name = this.name + this.delimiter + this.convertComponentsInNameString(componentsNew);
  }

  private asStringArray(asEscaped: boolean = false): string[] {
    const result: string[] = [];
    let comp = '';
    let skip = false;

    for (const ch of this.name) {
        if (skip) {
            skip = !skip;
            comp = comp.concat(ch);
            continue;
        }
        if (ch === "\\") {
            skip = true;
            continue;
        } else if (ch === this.delimiter) {
            result.push(comp);
            continue;
        }
        comp = comp.concat(ch);
    }
    return result;
  }

  /* private asUnescapedName(): string {
    return this.asUnEscapedComponent(this.name);
  } */

  // Todo Needs tests
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
    return result;
  }

  // Todo needs tests
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
