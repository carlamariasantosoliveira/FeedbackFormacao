import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const rulesPath = path.resolve(process.cwd(), 'firestore.rules');
const blueprintPath = path.resolve(process.cwd(), 'firebase-blueprint.json');
const rules = fs.readFileSync(rulesPath, 'utf8');
const blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf8'));

test('firestore.rules covers all blueprint collections and denies by default', () => {
  assert.match(rules, /rules_version\s*=\s*'2'/);
  assert.match(rules, /match \/\{document=\*\*\}\s*\{\s*allow read, write: if false;/);

  for (const collectionPath of Object.keys(blueprint.firestore)) {
    const segments = collectionPath.split('/').filter(Boolean);
    const leafCollection = segments[segments.length - 2];
    assert.ok(
      rules.includes(`match /${leafCollection}/`),
      `Missing match block for blueprint collection ${collectionPath}`
    );
  }
});

test('Dirty Dozen security invariants are structurally enforced in firestore.rules', () => {
  // Forbid list enumeration on all lookup/root collections
  assert.match(rules, /match \/system\/\{docId\}[\s\S]*allow list: if false;/);
  assert.match(rules, /match \/teacherAccess\/\{teacherHash\}[\s\S]*allow list: if false;/);
  assert.match(rules, /match \/workspaces\/\{workspaceKey\}[\s\S]*allow list: if false;/);
  assert.match(rules, /match \/publicFeedbacks\/\{accessHash\}[\s\S]*allow list: if false;/);

  // Path & hash guards
  assert.match(rules, /isValidId\(studentId\)/);
  assert.match(rules, /isValidHash\(accessHash\)/);
  assert.match(rules, /isValidHash\(teacherHash\)/);
  assert.match(rules, /isValidHash\(workspaceKey\)/);

  // Shadow field & size guards
  assert.match(rules, /data\.keys\(\)\.hasAll/);
  assert.match(rules, /data\.keys\(\)\.hasOnly/);
  assert.match(rules, /arr\.size\(\)\s*<=\s*6/);
  assert.match(rules, /data\.feedback\.size\(\)\s*<=\s*50000/);

  // Immutable fields & server timestamps
  assert.match(rules, /incoming\(\)\.workspaceKey\s*==\s*existing\(\)\.workspaceKey/);
  assert.match(rules, /incoming\(\)\.createdAt\s*==\s*existing\(\)\.createdAt/);
  assert.match(rules, /incoming\(\)\.updatedAt\s*==\s*request\.time/);

  // Atomic batch enforcement via existsAfter & activityType/observation validation
  assert.match(rules, /isValidActivityType/);
  assert.match(rules, /isValidObservationsList/);
  assert.match(rules, /criterioObservacoes/);
  assert.match(rules, /existsAfter\(\/databases\/\$\(database\)\/documents\/publicFeedbacks\//);
  assert.match(rules, /existsAfter\(\/databases\/\$\(database\)\/documents\/workspaces\//);
});
