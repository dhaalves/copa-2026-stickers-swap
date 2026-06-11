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
console.log('   ✅ Basic parsing passed.');

// Test 2: Compression of ranges
console.log('2. Testing range compression...');
const compressed = StickerParser.compressToRanges([4, 21, 24, 25, 26, 27, 30]);
assert.strictEqual(compressed, '4,21,24-27,30');
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
const parsedGeneratedState = StickerParser.parseAlbumCode(generatedCode);
assert.strictEqual(parsedGeneratedState.owned.size, stateForGen.owned.size);
for (const id of stateForGen.owned) {
  assert.ok(parsedGeneratedState.owned.has(id));
}
for (const [id, qty] of stateForGen.repeated.entries()) {
  assert.strictEqual(parsedGeneratedState.repeated.get(id), qty);
}
console.log('   ✅ Code generation passed.');

// Test 4: Album Matching
console.log('4. Testing sticker matching...');
const userA = {
  owned: new Set([1, 2, 3]),
  repeated: new Map([[4, 1], [1, 1]])
};
const userB = {
  owned: new Set([1, 5]),
  repeated: new Map([[2, 1], [6, 1]])
};

const matches = StickerParser.matchAlbums(userA, userB);
assert.deepStrictEqual(matches.give, [4]);
assert.deepStrictEqual(matches.receive, [6]);
console.log('   ✅ Sticker matching passed.');

// Test 5: Mapping Teams & Groups
console.log('5. Testing sticker to team/group mapping...');
// 1. Sticker 1 -> FWC 00
const info1 = StickerParser.getStickerInfo(1);
assert.strictEqual(info1.code, 'FWC');
assert.strictEqual(info1.group, 'FWC & CC');
assert.strictEqual(info1.relativeNumber, '00');

// 2. Sticker 20 -> FWC 19
const info20 = StickerParser.getStickerInfo(20);
assert.strictEqual(info20.code, 'FWC');
assert.strictEqual(info20.relativeNumber, 19);

// 3. Sticker 21 -> CC 1
const info21 = StickerParser.getStickerInfo(21);
assert.strictEqual(info21.code, 'CC');
assert.strictEqual(info21.relativeNumber, 1);

// 4. Sticker 34 -> CC 14
const info34 = StickerParser.getStickerInfo(34);
assert.strictEqual(info34.code, 'CC');
assert.strictEqual(info34.relativeNumber, 14);

// 3. Sticker 35 -> MEX (first team, first sticker)
const info35 = StickerParser.getStickerInfo(35);
assert.strictEqual(info35.code, 'MEX');
assert.strictEqual(info35.flag, '🇲🇽');
assert.strictEqual(info35.group, 'Grupo A');
assert.strictEqual(info35.relativeNumber, 1);

// 4. Sticker 54 -> MEX (first team, last sticker)
const info54 = StickerParser.getStickerInfo(54);
assert.strictEqual(info54.code, 'MEX');
assert.strictEqual(info54.relativeNumber, 20);

// 5. Sticker 55 -> RSA (second team, first sticker)
const info55 = StickerParser.getStickerInfo(55);
assert.strictEqual(info55.code, 'RSA');
assert.strictEqual(info55.flag, '🇿🇦');
assert.strictEqual(info55.relativeNumber, 1);

// 6. Sticker 994 -> PAN (last team, last sticker)
const info994 = StickerParser.getStickerInfo(994);
assert.strictEqual(info994.code, 'PAN');
assert.strictEqual(info994.flag, '🇵🇦');
assert.strictEqual(info994.group, 'Grupo L');
assert.strictEqual(info994.relativeNumber, 20);
console.log('   ✅ Team & group mapping tests passed.');

// Test 6: Compact format - Empty Album (Mode 2, Owned Ranges)
console.log('6. Testing empty album compression (Mode 2: Owned Ranges)...');
const emptyState = {
  albumId: 'SA26',
  version: '1',
  owned: new Set(),
  repeated: new Map()
};
const emptyCode = StickerParser.generateAlbumCode(emptyState);
console.log(`   Empty album code (${emptyCode.length} chars): ${emptyCode}`);
assert.ok(emptyCode.length <= 10, 'Empty album code should be very short');
const parsedEmptyState = StickerParser.parseAlbumCode(emptyCode);
assert.strictEqual(parsedEmptyState.owned.size, 0);
assert.strictEqual(parsedEmptyState.repeated.size, 0);
console.log('   ✅ Empty album tests passed.');

// Test 7: Compact format - Full Album (Mode 3, Missing Ranges)
console.log('7. Testing full album compression (Mode 3: Missing Ranges)...');
const fullOwnedSet = new Set();
for (let i = 1; i <= 994; i++) {
  fullOwnedSet.add(i);
}
const fullState = {
  albumId: 'SA26',
  version: '1',
  owned: fullOwnedSet,
  repeated: new Map()
};
const fullCode = StickerParser.generateAlbumCode(fullState);
console.log(`   Full album code (${fullCode.length} chars): ${fullCode}`);
assert.ok(fullCode.length <= 10, 'Full album code should be very short');
const parsedFullState = StickerParser.parseAlbumCode(fullCode);
assert.strictEqual(parsedFullState.owned.size, 994);
assert.strictEqual(parsedFullState.repeated.size, 0);
console.log('   ✅ Full album tests passed.');

// Test 8: Compact format - Sparse Album (Mode 1, Bitmask)
console.log('8. Testing sparse album compression (Mode 1: Bitmask)...');
const sparseOwnedSet = new Set();
// Populate every second sticker (497 stickers owned, which creates 497 ranges - exceeding bitmask limit)
for (let i = 1; i <= 994; i += 2) {
  sparseOwnedSet.add(i);
}
const sparseState = {
  albumId: 'SA26',
  version: '1',
  owned: sparseOwnedSet,
  repeated: new Map([[1, 2], [993, 3]])
};
const sparseCode = StickerParser.generateAlbumCode(sparseState);
console.log(`   Sparse album code (${sparseCode.length} chars): ${sparseCode.substring(0, 40)}...`);
assert.ok(sparseCode.length > 150, 'Sparse album should fall back to bitmask');
const parsedSparseState = StickerParser.parseAlbumCode(sparseCode);
assert.strictEqual(parsedSparseState.owned.size, 497);
assert.ok(parsedSparseState.owned.has(1));
assert.ok(!parsedSparseState.owned.has(2));
assert.ok(parsedSparseState.owned.has(993));
assert.strictEqual(parsedSparseState.repeated.get(1), 2);
assert.strictEqual(parsedSparseState.repeated.get(993), 3);
console.log('   ✅ Sparse album tests passed.');

// Test 9: Legacy format backward compatibility
console.log('9. Testing legacy format backward compatibility...');
const legacyCode = 'SA26|1|4,21,24-27|24:1,26:1,42:3';
const parsedLegacyState = StickerParser.parseAlbumCode(legacyCode);
assert.ok(parsedLegacyState.owned.has(4));
assert.ok(parsedLegacyState.owned.has(21));
assert.ok(parsedLegacyState.owned.has(25));
assert.strictEqual(parsedLegacyState.repeated.get(42), 3);
console.log('   ✅ Legacy format compatibility passed.');

console.log('\n🎉 All tests passed successfully!');
