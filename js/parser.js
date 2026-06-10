/**
 * Parser and Matcher for Copa 2026 Sticker Album
 * Format: ALBUM_CODE|VERSION|OWNED_STICKERS|REPEATED_STICKERS
 * Example: SA26|1|4,21,24-27|24:1,26:1,42:3
 */

const StickerParser = {
  TOTAL_STICKERS: 994,
  ALBUM_ID: 'SA26',
  VERSION: '1',

  /**
   * Parses an album code string into structured state.
   * @param {string} codeStr 
   * @returns {Object} { albumId, version, owned, repeated }
   */
  parseAlbumCode(codeStr) {
    const result = {
      albumId: this.ALBUM_ID,
      version: this.VERSION,
      owned: new Set(),
      repeated: new Map()
    };

    if (!codeStr || typeof codeStr !== 'string') {
      return result;
    }

    // Clean and split string
    const parts = codeStr.trim().split('|');
    if (parts.length < 3) {
      return result;
    }

    result.albumId = parts[0] || this.ALBUM_ID;
    result.version = parts[1] || this.VERSION;

    // Parse owned stickers (Part 2)
    const ownedPart = parts[2];
    if (ownedPart) {
      const items = ownedPart.split(',');
      for (const item of items) {
        if (!item) continue;
        if (item.includes('-')) {
          const [startStr, endStr] = item.split('-');
          const start = parseInt(startStr, 10);
          const end = parseInt(endStr, 10);
          if (!isNaN(start) && !isNaN(end)) {
            const min = Math.min(start, end);
            const max = Math.max(start, end);
            for (let i = min; i <= max; i++) {
              if (i >= 1 && i <= this.TOTAL_STICKERS) {
                result.owned.add(i);
              }
            }
          }
        } else {
          const val = parseInt(item, 10);
          if (!isNaN(val) && val >= 1 && val <= this.TOTAL_STICKERS) {
            result.owned.add(val);
          }
        }
      }
    }

    // Parse repeated stickers (Part 3)
    const repeatedPart = parts[3];
    if (repeatedPart) {
      const items = repeatedPart.split(',');
      for (const item of items) {
        if (!item) continue;
        if (item.includes(':')) {
          const [idStr, qtyStr] = item.split(':');
          const id = parseInt(idStr, 10);
          const qty = parseInt(qtyStr, 10);
          if (!isNaN(id) && !isNaN(qty) && id >= 1 && id <= this.TOTAL_STICKERS && qty > 0) {
            result.repeated.set(id, qty);
          }
        } else {
          const id = parseInt(item, 10);
          if (!isNaN(id) && id >= 1 && id <= this.TOTAL_STICKERS) {
            result.repeated.set(id, 1);
          }
        }
      }
    }

    return result;
  },

  /**
   * Compresses a list of sorted numbers into consecutive ranges.
   * @param {number[]} numbers 
   * @returns {string} e.g. "4,21,24-27"
   */
  compressToRanges(numbers) {
    if (!numbers || numbers.length === 0) return '';
    
    // Ensure sorted and unique
    const sorted = Array.from(new Set(numbers)).map(Number).sort((a, b) => a - b);
    const ranges = [];
    
    let start = sorted[0];
    let prev = sorted[0];
    
    for (let i = 1; i <= sorted.length; i++) {
      const current = sorted[i];
      if (current === prev + 1) {
        prev = current;
      } else {
        if (start === prev) {
          ranges.push(`${start}`);
        } else {
          ranges.push(`${start}-${prev}`);
        }
        start = current;
        prev = current;
      }
    }
    
    return ranges.join(',');
  },

  /**
   * Generates a string code from album state.
   * @param {Object} state { albumId, version, owned, repeated }
   * @returns {string}
   */
  generateAlbumCode(state) {
    const albumId = state.albumId || this.ALBUM_ID;
    const version = state.version || this.VERSION;
    
    const ownedArr = Array.from(state.owned || []);
    const ownedStr = this.compressToRanges(ownedArr);
    
    const repeatedArr = [];
    if (state.repeated) {
      // Sort repeated keys for deterministic output
      const sortedKeys = Array.from(state.repeated.keys()).sort((a, b) => a - b);
      for (const key of sortedKeys) {
        const qty = state.repeated.get(key);
        if (qty > 0) {
          repeatedArr.push(`${key}:${qty}`);
        }
      }
    }
    const repeatedStr = repeatedArr.join(',');
    
    return `${albumId}|${version}|${ownedStr}|${repeatedStr}`;
  },

  /**
   * Compares two album states to find trade matches.
   * @param {Object} stateA User A (Me) state
   * @param {Object} stateB User B (Other) state
   * @returns {Object} { give: number[], receive: number[] }
   */
  matchAlbums(stateA, stateB) {
    const give = [];    // Stickers User A has repeated that User B doesn't have in owned
    const receive = []; // Stickers User B has repeated that User A doesn't have in owned

    // A gives to B: A has repeated, B does NOT own
    if (stateA.repeated && stateB.owned) {
      for (const [id, qty] of stateA.repeated.entries()) {
        if (qty > 0 && !stateB.owned.has(id)) {
          give.push(id);
        }
      }
    }

    // B gives to A (A receives): B has repeated, A does NOT own
    if (stateB.repeated && stateA.owned) {
      for (const [id, qty] of stateB.repeated.entries()) {
        if (qty > 0 && !stateA.owned.has(id)) {
          receive.push(id);
        }
      }
    }

    // Sort outputs numerically
    give.sort((a, b) => a - b);
    receive.sort((a, b) => a - b);

    return { give, receive };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = StickerParser;
} else {
  window.StickerParser = StickerParser;
}
