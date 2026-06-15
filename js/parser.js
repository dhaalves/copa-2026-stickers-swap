/**
 * Parser and Matcher for Copa 2026 Sticker Album
 * Format: ALBUM_CODE|VERSION|OWNED_STICKERS|REPEATED_STICKERS
 * Example: SA26|1|4,21,24-27|24:1,26:1,42:3
 */

// Official 48 Teams of Copa 2026 grouped into 12 Groups (A to L)
const TEAMS = [
  // Group A
  { code: 'MEX', flag: '🇲🇽', name: 'México', group: 'Grupo A' },
  { code: 'RSA', flag: '🇿🇦', name: 'África do Sul', group: 'Grupo A' },
  { code: 'KOR', flag: '🇰🇷', name: 'Coreia do Sul', group: 'Grupo A' },
  { code: 'CZE', flag: '🇨🇿', name: 'República Tcheca', group: 'Grupo A' },
  // Group B
  { code: 'CAN', flag: '🇨🇦', name: 'Canadá', group: 'Grupo B' },
  { code: 'BIH', flag: '🇧🇦', name: 'Bósnia-Herzegovina', group: 'Grupo B' },
  { code: 'QAT', flag: '🇶🇦', name: 'Catar', group: 'Grupo B' },
  { code: 'SUI', flag: '🇨🇭', name: 'Suíça', group: 'Grupo B' },
  // Group C
  { code: 'BRA', flag: '🇧🇷', name: 'Brasil', group: 'Grupo C' },
  { code: 'MAR', flag: '🇲🇦', name: 'Marrocos', group: 'Grupo C' },
  { code: 'HAI', flag: '🇭🇹', name: 'Haiti', group: 'Grupo C' },
  { code: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', name: 'Escócia', group: 'Grupo C' },
  // Group D
  { code: 'USA', flag: '🇺🇸', name: 'Estados Unidos', group: 'Grupo D' },
  { code: 'PAR', flag: '🇵🇾', name: 'Paraguai', group: 'Grupo D' },
  { code: 'AUS', flag: '🇦🇺', name: 'Austrália', group: 'Grupo D' },
  { code: 'TUR', flag: '🇹🇷', name: 'Turquia', group: 'Grupo D' },
  // Group E
  { code: 'GER', flag: '🇩🇪', name: 'Alemanha', group: 'Grupo E' },
  { code: 'CUW', flag: '🇨🇼', name: 'Curaçao', group: 'Grupo E' },
  { code: 'CIV', flag: '🇨🇮', name: 'Costa do Marfim', group: 'Grupo E' },
  { code: 'ECU', flag: '🇪🇨', name: 'Equador', group: 'Grupo E' },
  // Group F
  { code: 'NED', flag: '🇳🇱', name: 'Holanda', group: 'Grupo F' },
  { code: 'JPN', flag: '🇯🇵', name: 'Japão', group: 'Grupo F' },
  { code: 'SWE', flag: '🇸🇪', name: 'Suécia', group: 'Grupo F' },
  { code: 'TUN', flag: '🇹🇳', name: 'Tunísia', group: 'Grupo F' },
  // Group G
  { code: 'BEL', flag: '🇧🇪', name: 'Bélgica', group: 'Grupo G' },
  { code: 'EGY', flag: '🇪🇬', name: 'Egito', group: 'Grupo G' },
  { code: 'IRN', flag: '🇮🇷', name: 'Irã', group: 'Grupo G' },
  { code: 'NZL', flag: '🇳🇿', name: 'Nova Zelândia', group: 'Grupo G' },
  // Group H
  { code: 'ESP', flag: '🇪🇸', name: 'Espanha', group: 'Grupo H' },
  { code: 'CPV', flag: '🇨🇻', name: 'Cabo Verde', group: 'Grupo H' },
  { code: 'KSA', flag: '🇸🇦', name: 'Arábia Saudita', group: 'Grupo H' },
  { code: 'URU', flag: '🇺🇾', name: 'Uruguai', group: 'Grupo H' },
  // Group I
  { code: 'FRA', flag: '🇫🇷', name: 'França', group: 'Grupo I' },
  { code: 'SEN', flag: '🇸🇳', name: 'Senegal', group: 'Grupo I' },
  { code: 'IRQ', flag: '🇮🇶', name: 'Iraque', group: 'Grupo I' },
  { code: 'NOR', flag: '🇳🇴', name: 'Noruega', group: 'Grupo I' },
  // Group J
  { code: 'ARG', flag: '🇦🇷', name: 'Argentina', group: 'Grupo J' },
  { code: 'ALG', flag: '🇩🇿', name: 'Argélia', group: 'Grupo J' },
  { code: 'AUT', flag: '🇦🇹', name: 'Áustria', group: 'Grupo J' },
  { code: 'JOR', flag: '🇯🇴', name: 'Jordânia', group: 'Grupo J' },
  // Group K
  { code: 'POR', flag: '🇵🇹', name: 'Portugal', group: 'Grupo K' },
  { code: 'COD', flag: '🇨🇩', name: 'República Democrática do Congo', group: 'Grupo K' },
  { code: 'UZB', flag: '🇺🇿', name: 'Uzbequistão', group: 'Grupo K' },
  { code: 'COL', flag: '🇨🇴', name: 'Colômbia', group: 'Grupo K' },
  // Group L
  { code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'Inglaterra', group: 'Grupo L' },
  { code: 'CRO', flag: '🇭🇷', name: 'Croácia', group: 'Grupo L' },
  { code: 'GHA', flag: '🇬🇭', name: 'Gana', group: 'Grupo L' },
  { code: 'PAN', flag: '🇵🇦', name: 'Panamá', group: 'Grupo L' }
];

/**
 * Helper to convert Uint8Array to Base64URL string
 */
function uint8ArrayToBase64URL(uint8) {
  let binary = '';
  const len = uint8.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8[i]);
  }
  const base64 = typeof btoa !== 'undefined'
    ? btoa(binary)
    : Buffer.from(binary, 'binary').toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Helper to convert Base64URL string to Uint8Array
 */
function base64URLToUint8Array(base64url) {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = typeof atob !== 'undefined'
    ? atob(base64)
    : Buffer.from(base64, 'base64').toString('binary');
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Helper to compute ranges [start, end] from sorted array of numbers
 */
function getRanges(numbers) {
  if (!numbers || numbers.length === 0) return [];
  const sorted = Array.from(new Set(numbers)).map(Number).sort((a, b) => a - b);
  const ranges = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i <= sorted.length; i++) {
    const current = sorted[i];
    if (current === prev + 1) {
      prev = current;
    } else {
      ranges.push([start, prev]);
      if (current !== undefined) {
        start = current;
        prev = current;
      }
    }
  }
  return ranges;
}

/**
 * Encodes album state into a highly compact binary format.
 */
function encodeStateToBinary(state, totalStickers) {
  const ownedArr = Array.from(state.owned || []).map(Number).sort((a, b) => a - b);
  
  const ownedRanges = getRanges(ownedArr);
  
  const missing = [];
  for (let i = 1; i <= totalStickers; i++) {
    if (!state.owned || !state.owned.has(i)) {
      missing.push(i);
    }
  }
  const missingRanges = getRanges(missing);

  let mode = 1; // 1 = Bitmask, 2 = Owned Ranges, 3 = Missing Ranges
  let rangeData = [];
  
  const ownedRangeCost = ownedRanges.length * 4;
  const missingRangeCost = missingRanges.length * 4;
  
  if (ownedRangeCost < 125 && ownedRangeCost <= missingRangeCost) {
    mode = 2;
    rangeData = ownedRanges;
  } else if (missingRangeCost < 125) {
    mode = 3;
    rangeData = missingRanges;
  }

  const repeats = [];
  if (state.repeated) {
    for (const [id, qty] of state.repeated.entries()) {
      if (qty > 0 && id >= 1 && id <= totalStickers) {
        repeats.push({ id, qty });
      }
    }
  }
  repeats.sort((a, b) => a.id - b.id);

  let buffer;
  if (mode === 1) {
    const ownedBitmask = new Uint8Array(125);
    for (const id of ownedArr) {
      if (id >= 1 && id <= totalStickers) {
        const idx = id - 1;
        const byteIdx = Math.floor(idx / 8);
        const bitIdx = idx % 8;
        ownedBitmask[byteIdx] |= (1 << bitIdx);
      }
    }
    buffer = new Uint8Array(1 + 125 + 2 + repeats.length * 3);
    buffer[0] = 1; // Mode 1
    buffer.set(ownedBitmask, 1);
    
    const numRepeats = repeats.length;
    buffer[126] = (numRepeats >> 8) & 0xFF;
    buffer[127] = numRepeats & 0xFF;
    
    let offset = 128;
    for (const rep of repeats) {
      buffer[offset] = (rep.id >> 8) & 0xFF;
      buffer[offset + 1] = rep.id & 0xFF;
      buffer[offset + 2] = Math.min(rep.qty, 255);
      offset += 3;
    }
  } else {
    const numRanges = rangeData.length;
    buffer = new Uint8Array(1 + 2 + numRanges * 4 + 2 + repeats.length * 3);
    buffer[0] = mode; // Mode 2 or 3
    
    buffer[1] = (numRanges >> 8) & 0xFF;
    buffer[2] = numRanges & 0xFF;
    
    let offset = 3;
    for (const r of rangeData) {
      buffer[offset] = (r[0] >> 8) & 0xFF;
      buffer[offset + 1] = r[0] & 0xFF;
      buffer[offset + 2] = (r[1] >> 8) & 0xFF;
      buffer[offset + 3] = r[1] & 0xFF;
      offset += 4;
    }
    
    const numRepeats = repeats.length;
    buffer[offset] = (numRepeats >> 8) & 0xFF;
    buffer[offset + 1] = numRepeats & 0xFF;
    offset += 2;
    
    for (const rep of repeats) {
      buffer[offset] = (rep.id >> 8) & 0xFF;
      buffer[offset + 1] = rep.id & 0xFF;
      buffer[offset + 2] = Math.min(rep.qty, 255);
      offset += 3;
    }
  }

  return buffer;
}

/**
 * Decodes album state from the compact binary format.
 */
function decodeBinaryToState(buffer, totalStickers) {
  const state = {
    albumId: 'SA26',
    version: '1',
    owned: new Set(),
    repeated: new Map()
  };

  if (buffer.length < 5) {
    return state;
  }

  const mode = buffer[0];

  if (mode === 1) {
    if (buffer.length < 128) return state;
    const ownedBitmask = buffer.subarray(1, 126);
    for (let idx = 0; idx < totalStickers; idx++) {
      const byteIdx = Math.floor(idx / 8);
      const bitIdx = idx % 8;
      if ((ownedBitmask[byteIdx] & (1 << bitIdx)) !== 0) {
        state.owned.add(idx + 1);
      }
    }
    
    const numRepeats = (buffer[126] << 8) | buffer[127];
    let offset = 128;
    for (let i = 0; i < numRepeats; i++) {
      if (offset + 2 >= buffer.length) break;
      const id = (buffer[offset] << 8) | buffer[offset + 1];
      const qty = buffer[offset + 2];
      if (id >= 1 && id <= totalStickers && qty > 0) {
        state.repeated.set(id, qty);
      }
      offset += 3;
    }
  } else if (mode === 2 || mode === 3) {
    let numRanges = (buffer[1] << 8) | buffer[2];
    if (numRanges > 1000) numRanges = 1000; // DoS prevention
    let offset = 3;
    const ranges = [];
    for (let i = 0; i < numRanges; i++) {
      if (offset + 3 >= buffer.length) break;
      const startRaw = (buffer[offset] << 8) | buffer[offset + 1];
      const endRaw = (buffer[offset + 2] << 8) | buffer[offset + 3];

      const min = Math.max(1, Math.min(startRaw, endRaw));
      const max = Math.min(totalStickers, Math.max(startRaw, endRaw));

      if (min <= max) {
        ranges.push([min, max]);
      }
      offset += 4;
    }

    if (mode === 2) {
      ranges.sort((a, b) => a[0] - b[0]);
      const mergedRanges = [];
      if (ranges.length > 0) {
        let current = ranges[0];
        for (let i = 1; i < ranges.length; i++) {
          if (ranges[i][0] <= current[1] + 1) {
            current[1] = Math.max(current[1], ranges[i][1]);
          } else {
            mergedRanges.push(current);
            current = ranges[i];
          }
        }
        mergedRanges.push(current);
      }
      for (const r of mergedRanges) {
        for (let id = r[0]; id <= r[1]; id++) {
          state.owned.add(id);
        }
      }
    } else {
      const missingSet = new Set();
      ranges.sort((a, b) => a[0] - b[0]);
      const mergedRanges = [];
      if (ranges.length > 0) {
        let current = ranges[0];
        for (let i = 1; i < ranges.length; i++) {
          if (ranges[i][0] <= current[1] + 1) {
            current[1] = Math.max(current[1], ranges[i][1]);
          } else {
            mergedRanges.push(current);
            current = ranges[i];
          }
        }
        mergedRanges.push(current);
      }
      for (const r of mergedRanges) {
        for (let id = r[0]; id <= r[1]; id++) {
          missingSet.add(id);
        }
      }
      for (let id = 1; id <= totalStickers; id++) {
        if (!missingSet.has(id)) {
          state.owned.add(id);
        }
      }
    }

    if (offset + 1 < buffer.length) {
      const numRepeats = (buffer[offset] << 8) | buffer[offset + 1];
      offset += 2;
      for (let i = 0; i < numRepeats; i++) {
        if (offset + 2 >= buffer.length) break;
        const id = (buffer[offset] << 8) | buffer[offset + 1];
        const qty = buffer[offset + 2];
        if (id >= 1 && id <= totalStickers && qty > 0) {
          state.repeated.set(id, qty);
        }
        offset += 3;
      }
    }
  }

  return state;
}

const StickerParser = {
  TOTAL_STICKERS: 994,
  ALBUM_ID: 'SA26',
  VERSION: '1',
  TEAMS: TEAMS,

  /**
   * Gets details for a specific sticker ID.
   * @param {number} id 
   * @returns {Object|null}
   */
  getStickerInfo(id) {
    if (id < 1 || id > this.TOTAL_STICKERS) return null;
    
    // FWC (1 to 20) and CC (21 to 34)
    if (id <= 34) {
      if (id <= 20) {
        return {
          code: 'FWC',
          flag: '🏆',
          name: 'FIFA World Cup',
          group: 'FWC & CC',
          relativeNumber: id === 1 ? '00' : id - 1
        };
      } else {
        return {
          code: 'CC',
          flag: '🥤',
          name: 'Coca-Cola',
          group: 'FWC & CC',
          relativeNumber: id - 20
        };
      }
    }
    
    // Teams (35 to 994)
    // 48 teams of 20 stickers each
    const teamIndex = Math.floor((id - 35) / 20);
    if (teamIndex >= 0 && teamIndex < TEAMS.length) {
      const team = TEAMS[teamIndex];
      const relativeNumber = ((id - 35) % 20) + 1;
      return {
        code: team.code,
        flag: team.flag,
        name: team.name,
        group: team.group,
        relativeNumber: relativeNumber
      };
    }
    
    return null;
  },

  /**
   * Gets sticker ID from a code and relative number string.
   * @param {string} code
   * @param {string} relativeNumberStr
   * @returns {number|null}
   */
  getIdFromInfo(code, relativeNumberStr) {
    if (!relativeNumberStr) return null;
    const rnum = relativeNumberStr.trim();
    if (code === 'FWC') {
      if (rnum === '00') return 1;
      const num = parseInt(rnum, 10);
      if (!isNaN(num) && num >= 1 && num <= 19) return num + 1;
    } else if (code === 'CC') {
      const num = parseInt(rnum, 10);
      if (!isNaN(num) && num >= 1 && num <= 14) return num + 20;
    } else {
      const teamIndex = TEAMS.findIndex(t => t.code === code);
      if (teamIndex !== -1) {
        const num = parseInt(rnum, 10);
        if (!isNaN(num) && num >= 1 && num <= 20) {
          return 35 + (teamIndex * 20) + (num - 1);
        }
      }
    }
    return null;
  },

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

    let trimmed = codeStr.trim();

    // Extract base64 code if it's a URL
    try {
      if (trimmed.includes('http') || trimmed.includes('partner=')) {
        const urlMatch = trimmed.match(/partner=([A-Za-z0-9_-]+)/);
        if (urlMatch) {
          trimmed = urlMatch[1];
        }
      }
    } catch (e) {
      console.error("Failed to extract URL parameter:", e);
    }

    if (trimmed.includes('|')) {
      const parts = trimmed.split('|');
      if (parts.length < 3) {
        return result;
      }

      result.albumId = parts[0] || this.ALBUM_ID;
      result.version = parts[1] || this.VERSION;

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
              const min = Math.max(1, Math.min(start, end));
              const max = Math.min(this.TOTAL_STICKERS, Math.max(start, end));
              for (let i = min; i <= max; i++) {
                result.owned.add(i);
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
    } else {
      try {
        if (!/^[A-Za-z0-9_-]+$/.test(trimmed)) {
          throw new Error("Not a valid base64url string");
        }
        const bytes = base64URLToUint8Array(trimmed);
        return decodeBinaryToState(bytes, this.TOTAL_STICKERS);
      } catch (e) {
        const lowerTrimmed = trimmed.toLowerCase();
        // Check if it matches a typical text format by testing for country code matches or keywords
        const isTextFormat = trimmed.includes(':') || lowerTrimmed.includes('faltante') || lowerTrimmed.includes('repetida') || /^([A-Z]{2,3})(?:.*?):\s*(.+)$/im.test(trimmed);

        if (isTextFormat) {
          const lines = trimmed.split('\n');
          let currentMode = 'owned'; // default
          const missingSet = new Set();
          let hasMissing = false;

          for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            const lower = line.toLowerCase();
            if (lower.includes('repetida') || lower === 'repetidas' || lower === 'repetidas:') {
              currentMode = 'repeated';
              continue;
            }
            if (lower.includes('faltante') || lower === 'faltantes' || lower === 'faltantes:') {
              currentMode = 'missing';
              continue;
            }
            if (lower.includes('tenho') || lower === 'completas' || lower === 'completas:') {
              currentMode = 'owned';
              continue;
            }

            const match = line.match(/^([A-Z]{2,3})(?:.*?):\s*(.+)$/i);
            if (match) {
              const code = match[1].toUpperCase();
              const numbersStr = match[2];
              const numbers = numbersStr.split(',').map(s => s.trim()).filter(s => s);

              for (const numStr of numbers) {
                const id = this.getIdFromInfo(code, numStr);
                if (id) {
                  if (currentMode === 'missing') {
                    missingSet.add(id);
                    hasMissing = true;
                  } else if (currentMode === 'repeated') {
                    const qty = result.repeated.get(id) || 0;
                    result.repeated.set(id, qty + 1);
                  } else if (currentMode === 'owned') {
                    result.owned.add(id);
                  }
                }
              }
            }
          }

          if (hasMissing) {
            for (let i = 1; i <= this.TOTAL_STICKERS; i++) {
              if (!missingSet.has(i)) {
                result.owned.add(i);
              }
            }
          }
          return result;
        }

        console.error("Failed to decode binary album code:", e);
        return result;
      }
    }
  },

  /**
   * Compresses a list of sorted numbers into consecutive ranges.
   * @param {number[]} numbers 
   * @returns {string} e.g. "4,21,24-27"
   */
  compressToRanges(numbers) {
    if (!numbers || numbers.length === 0) return '';
    
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
    try {
      const bytes = encodeStateToBinary(state, this.TOTAL_STICKERS);
      return uint8ArrayToBase64URL(bytes);
    } catch (e) {
      console.error("Failed to generate binary album code, falling back to text:", e);
      const albumId = state.albumId || this.ALBUM_ID;
      const version = state.version || this.VERSION;
      
      const ownedArr = Array.from(state.owned || []);
      const ownedStr = this.compressToRanges(ownedArr);
      
      const repeatedArr = [];
      if (state.repeated) {
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
    }
  },

  /**
   * Compares two album states to find trade matches.
   * @param {Object} stateA User A (Me) state
   * @param {Object} stateB User B (Other) state
   * @returns {Object} { give: number[], receive: number[] }
   */
  matchAlbums(stateA, stateB) {
    const give = [];
    const receive = [];

    if (stateA.repeated && stateB.owned) {
      for (const [id, qty] of stateA.repeated.entries()) {
        if (qty > 0 && !stateB.owned.has(id)) {
          give.push(id);
        }
      }
    }

    if (stateB.repeated && stateA.owned) {
      for (const [id, qty] of stateB.repeated.entries()) {
        if (qty > 0 && !stateA.owned.has(id)) {
          receive.push(id);
        }
      }
    }

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
