const assert = require('assert');
const StickerParser = require('./parser');

console.log('🧪 Starting tests for StickerParser...');

// Test 1: Parser - Basic Parsing
console.log('1. Testing basic code parsing...');
const code1 = 'SA26|1|4,21,24-27|24:1,26:1,42:3';
const state1 = StickerParser.parseAlbumCode(code1);

assert.strictEqual(state1.albumId, 'SA26');
assert.strictEqual(state1.version, '1');
assert.ok(state1.owned.has(4));
assert.ok(state1.owned.has(21));
assert.ok(state1.owned.has(24));
assert.ok(state1.owned.has(25));
assert.ok(state1.owned.has(26));
assert.ok(state1.owned.has(27));
assert.ok(!state1.owned.has(28));

assert.strictEqual(state1.repeated.get(24), 1);
assert.strictEqual(state1.repeated.get(26), 1);
assert.strictEqual(state1.repeated.get(42), 3);
assert.strictEqual(state1.repeated.get(10), undefined);
console.log('   ✅ Basic parsing passed.');

// Test 2: Compression of ranges
console.log('2. Testing range compression...');
const compressed = StickerParser.compressToRanges([4, 21, 24, 25, 26, 27, 30]);
assert.strictEqual(compressed, '4,21,24-27,30');

const compressedSingle = StickerParser.compressToRanges([42]);
assert.strictEqual(compressedSingle, '42');

const compressedEmpty = StickerParser.compressToRanges([]);
assert.strictEqual(compressedEmpty, '');
console.log('   ✅ Range compression passed.');

// Test 3: Code Generation
console.log('3. Testing code generation...');
const stateForGen = {
  albumId: 'SA26',
  version: '1',
  owned: new Set([4, 21, 24, 25, 26, 27]),
  repeated: new Map([[24, 1], [26, 1], [42, 3]])
};
const generatedCode = StickerParser.generateAlbumCode(stateForGen);
assert.strictEqual(generatedCode, 'SA26|1|4,21,24-27|24:1,26:1,42:3');
console.log('   ✅ Code generation passed.');

// Test 4: Album Matching
console.log('4. Testing sticker matching...');
// User A: Has 1, 2, 3 in album. Repeated: 4:1 (B doesn't have 4), 1:1 (B has 1).
const userA = {
  owned: new Set([1, 2, 3]),
  repeated: new Map([[4, 1], [1, 1]])
};
// User B: Has 1, 5 in album. Repeated: 2:1 (A has 2), 6:1 (A doesn't have 6).
const userB = {
  owned: new Set([1, 5]),
  repeated: new Map([[2, 1], [6, 1]])
};

const matches = StickerParser.matchAlbums(userA, userB);
// A gives B: 4 (B has 1 and 5, so B needs 4. A has 1 repeated but B has 1 owned, so B doesn't need 1)
assert.deepStrictEqual(matches.give, [4]);
// A receives from B: 6 (A has 1, 2, 3 owned. B has 2 repeated but A owns 2, so A doesn't need 2. B has 6 repeated and A lacks 6, so A gets 6)
assert.deepStrictEqual(matches.receive, [6]);
console.log('   ✅ Sticker matching passed.');

// Test 5: Parsing edge cases
console.log('5. Testing parsing edge cases...');
const emptyState = StickerParser.parseAlbumCode('');
assert.strictEqual(emptyState.owned.size, 0);
assert.strictEqual(emptyState.repeated.size, 0);

const invalidCode = 'SA26|1';
const invalidState = StickerParser.parseAlbumCode(invalidCode);
assert.strictEqual(invalidState.owned.size, 0);
assert.strictEqual(invalidState.repeated.size, 0);

const repeatedWithNoQuantity = StickerParser.parseAlbumCode('SA26|1|1|42');
assert.strictEqual(repeatedWithNoQuantity.repeated.get(42), 1);
console.log('   ✅ Edge cases passed.');

console.log('\n🎉 All tests passed successfully!');
