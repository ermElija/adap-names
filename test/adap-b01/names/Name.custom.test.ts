import { describe, expect, it } from "vitest";
import { Name } from "../../../src/adap-b01/names/Name";

const testInputSamples: string[] = [
    'example.com',
    'api.v1.users',
    'db.cluster.node3',
    'project.team.member.id',
    'system.module.submodule.component',
    'a.b.c',
    'version.001.alpha',
    '_foo._bar._baz',
    'user..profile',
    'service.region..id',
    'a-1.a-2.a-3',
    'alpha.beta.gamma.delta.epsilon.zeta',
    'data123.data456.data789',
    'Übung.Test.Fall',
    '名前.データ.項目',
    'env:prod:us-east:node42',
    'root/branch/leaf',
    'user_profile_image',
];

const testInputComponents: string[][] = [
    ['example', 'com'],
    ['api', 'v1', 'users'],
    ['db', 'cluster', 'node3'],
    ['project', 'team', 'member', 'id'],
    ['system', 'module', 'submodule', 'component'],
    ['a', 'b', 'c'],
    ['version', '001', 'alpha'],
    ['_foo', '_bar', '_baz'],
    ['user', '', 'profile'],
    ['service', 'region', '', 'id'],
    ['a-1', 'a-2', 'a-3'],
    ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta'],
    ['data123', 'data456', 'data789'],
    ['Übung', 'Test', 'Fall'],
    ['名前', 'データ', '項目'],
    ['env', 'prod', 'us-east', 'node42'],
    ['root', 'branch', 'leaf'],
    ['user_profile_image'],
];


// Each test method of Names should be annotated with @methodtype
//describe('correct test annotation')

describe('constructor tests', () => {

});

describe('asString tests', () => {

    it('returns correct string _ without init + param delimiter', () => {
        const n = new Name(['version', '001', 'alpha']);
        expect(n.asString()).equals('version.001.alpha');
    });

    it('returns correct string _ without init but param delimiter', () => {
        const n = new Name(['_foo', '_bar', '_baz']);
        expect(n.asString('/')).equals('_foo/_bar/_baz');
    });

    it('returns correct string _ with init but no param delimiter', () => {
        const n = new Name(['version', '001', 'alpha'], '%');
        expect(n.asString()).equals('version%001%alpha');
    });

    it('returns correct string _ with init + param delimiter', () => {
        const n = new Name(['a-1', 'a-2', 'a-3'], '$');
        expect(n.asString('-')).equals('a-1-a-2-a-3');
    });

    it('returns error for empty components iput', () => {
        expect(() => new Name([])).toThrowError();
    });
});

// ? Geht meine Implementierung korrekt mit leeren Komponenten um?

describe('asDataString test', () => {
    it('1_no_special_characters', () => {
        const n = new Name(['data123', 'data456', 'data789']);
        expect(n.asDataString()).equals('data123\\.data456\\.data789');
    });

    it('2_special_character', () => {
        const n = new Name(['ab.', 'c', 'd', 'e.']);
        expect(n.asDataString()).equals('ab\\.\\.c\\.d\\.e\\.');
    });
});

describe('getComponent()', () => {
    it('gets first component', () => {
        const n = new Name(['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta'], '/');
        expect(n.getComponent(0)).equals('alpha');
    });

    it('gets correct component', () => {
        const n = new Name(['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta'], '/');
        expect(n.getComponent(2)).equals('gamma');
    });

    it('gets last component', () => {
        const n = new Name(['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta'], '/');
        expect(n.getComponent(5)).equals('zeta');
    });

    it('throws error when index out of bound', () => {
        const n = new Name(['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta'], '/');
        expect(() => n.getComponent(10)).toThrowError();
    });
});

describe('setComponent()', () => {
    it('sets replaces component in correct position', () => {
        const n = new Name(['version!', '001', 'alpha']);
        n.setComponent(0, 'TeNeT');
        expect(n.asString()).equals('TeNeT.001.alpha');
    });

    it('replaces last position correctly', () => {
        const n = new Name(['version!', '001', 'alpha']);
        n.setComponent(2, 'TeNeT');
        expect(n.asString()).equals('version!.001.TeNeT');
    });
});

describe('getNoOfComponents()', () => {
    it('gets correct number of components', () => {
        const n = new Name(['a', 'b', '', '', 'e'], '/');
        expect(n.getNoComponents()).toBe(5);
    });
});

describe('insert()', () => {
    it('inserts corectly at first position', () => {
        const n = new Name(['a-1', 'a-2', 'a-3'], '!');
        n.insert(0, 'cc');
        expect(n.asString()).equals('cc!a-1!a-2!a-3');
    });

    it('correctly inserts at some position', () => {
        const n = new Name(['a-1', 'a-2', 'a-3'], '!');
        n.insert(1, 'cc');
        expect(n.asString()).equals('a-1!cc!a-2!a-3');
    });

    it('correctly insersts at last position', () => {
        const n = new Name(['a-1', 'a-2', 'a-3'], '!');
        n.insert(3, 'cc');
        expect(n.asString()).equals('a-1!a-2!a-3!cc');
    });
});

describe('append()', () => {
    it('appends correctly', () => {
        const n = new Name(['a-1', 'a-2', 'a-3']);
        n.append('Tenet');
        expect(n.asString()).equals('a-1.a-2.a-3.Tenet');
    });
});

describe('remove()', () => {
    it('removes correctly at the beginning', () => {
        const n = new Name(['api', 'v1', 'users']);
        n.remove(0);
        expect(n.asString()).equals('v1.users');
    });

    it('removes correctly at the end', () => {
        const n = new Name(['api', 'v1', 'users']);
        n.remove(2);
        expect(n.asString()).equals('api.v1');
    });
});