export function isSubstringOfArrayContained(a: string, b:string[]): boolean {
    for (let part of b) {
        if (a.includes(part)) return true;
    }
    return false;
}