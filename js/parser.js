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
    
    // Intro & Stadiums (1 to 34)
    if (id <= 34) {
      return {
        code: 'FWC',
        flag: '🏆',
        name: 'Intro & Estádios',
        group: 'Intro',
        relativeNumber: id
      };
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

    const parts = codeStr.trim().split('|');
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
