import { describe, expect, it } from "vitest";
import { Name } from "./Name";

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

describe.only('constructor tests', () => {

    it('abc', () => {
        const n = new Name(['db', 'cluster', 'node3']);
        expect(n.getInternalRepresentation()).equals(['db', 'cluster', 'node3']);
    });
});