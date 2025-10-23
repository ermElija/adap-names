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

    it('abc', () => {
        const n = new Name(['db', 'cluster', 'node3']);
        expect(n.getInternalRepresentation()).toEqual(['db', 'cluster', 'node3']);
    });
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

    /* it('returns error for empty components iput', () => {
        expect().toThrowError(new Name([]));
    }); */
});

