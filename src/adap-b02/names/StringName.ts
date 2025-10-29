import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;
  protected name: string = "";
  protected noComponents: number = 0;

  constructor(source: string, delimiter?: string) {
    this.assertValidDelimiter(delimiter);
    // ? Assert source?

    this.name = source;
  }

  public asString(delimiter: string = this.delimiter): string {
    const comp = this.asStringArray();
    let result = '';
    for (let i = 0; i < comp.length; i++) {
        result = result + delimiter + comp[i];
    }
    return result;
  }

  public asDataString(): string {
    throw new Error("needs implementation or deletion");
  }

  public getDelimiterCharacter(): string {
    throw new Error("needs implementation or deletion");
  }

  public isEmpty(): boolean {
    throw new Error("needs implementation or deletion");
  }

  public getNoComponents(): number {
    throw new Error("needs implementation or deletion");
  }

  public getComponent(x: number): string {
    throw new Error("needs implementation or deletion");
  }

  public setComponent(n: number, c: string): void {
    throw new Error("needs implementation or deletion");
  }

  public insert(n: number, c: string): void {
    throw new Error("needs implementation or deletion");
  }

  public append(c: string): void {
    throw new Error("needs implementation or deletion");
  }

  public remove(n: number): void {
    throw new Error("needs implementation or deletion");
  }

  public concat(other: Name): void {
    throw new Error("needs implementation or deletion");
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
    if (isEndAllowed) {
      if (i < 0 || i >= this.components.length + 1)
        throw new Error("index out of bounds");
    } else {
      if (i < 0 || i >= this.components.length)
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
}
