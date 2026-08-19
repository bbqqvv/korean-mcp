// 2-Bolsik QWERTY to Hangul Mapping (Lower & Upper Shift Cases)
export const QWERTY_TO_HANGUL: Record<string, string> = {
  q: 'ㅂ', Q: 'ㅃ', w: 'ㅈ', W: 'ㅉ', e: 'ㄷ', E: 'ㄸ', r: 'ㄱ', R: 'ㄲ', t: 'ㅅ', T: 'ㅆ',
  y: 'ㅛ', Y: 'ㅛ', u: 'ㅕ', U: 'ㅕ', i: 'ㅑ', I: 'ㅑ', o: 'ㅐ', O: 'ㅒ', p: 'ㅔ', P: 'ㅖ',
  a: 'ㅁ', A: 'ㅁ', s: 'ㄴ', S: 'ㄴ', d: 'ㅇ', D: 'ㅇ', f: 'ㄹ', F: 'ㄹ', g: 'ㅎ', G: 'ㅎ',
  h: 'ㅗ', H: 'ㅗ', j: 'ㅓ', J: 'ㅓ', k: 'ㅏ', K: 'ㅏ', l: 'ㅣ', L: 'ㅣ',
  z: 'ㅋ', Z: 'ㅋ', x: 'ㅌ', X: 'ㅌ', c: 'ㅊ', C: 'ㅊ', v: 'ㅍ', V: 'ㅍ',
  b: 'ㅠ', B: 'ㅠ', n: 'ㅜ', N: 'ㅜ', m: 'ㅡ', M: 'ㅡ'
};

// Inverse Hangul to QWERTY key
export const HANGUL_TO_QWERTY: Record<string, string> = {};
Object.entries(QWERTY_TO_HANGUL).forEach(([qwerty, hangul]) => {
  if (!HANGUL_TO_QWERTY[hangul]) {
    HANGUL_TO_QWERTY[hangul] = qwerty.toLowerCase();
  }
});

// Unicode Hangul Decomposition & Composition Constants
export const INITIAL_CONSONANTS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
export const MEDIAL_VOWELS = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ'];
export const FINAL_CONSONANTS = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

export const COMPOUND_VOWEL_SPLIT: Record<string, string[]> = {
  'ㅘ': ['ㅗ', 'ㅏ'],
  'ㅙ': ['ㅗ', 'ㅐ'],
  'ㅚ': ['ㅗ', 'ㅣ'],
  'ㅝ': ['ㅜ', 'ㅓ'],
  'ㅞ': ['ㅜ', 'ㅔ'],
  'ㅟ': ['ㅜ', 'ㅣ'],
  'ㅢ': ['ㅡ', 'ㅣ']
};

export const COMPOUND_BATCHIM_SPLIT: Record<string, string[]> = {
  'ㄳ': ['ㄱ', 'ㅅ'],
  'ㄵ': ['ㄴ', 'ㅈ'],
  'ㄶ': ['ㄴ', 'ㅎ'],
  'ㄺ': ['ㄹ', 'ㄱ'],
  'ㄻ': ['ㄹ', 'ㅁ'],
  'ㄼ': ['ㄹ', 'ㅂ'],
  'ㄽ': ['ㄹ', 'ㅅ'],
  'ㄾ': ['ㄹ', 'ㅌ'],
  'ㄿ': ['ㄹ', 'ㅍ'],
  'ㅀ': ['ㄹ', 'ㅎ'],
  'ㅄ': ['ㅂ', 'ㅅ']
};

export function decomposeSyllableToJamo(char: string): string[] {
  const code = char.charCodeAt(0);
  if (code >= 0xAC00 && code <= 0xD7A3) {
    const index = code - 0xAC00;
    const initIdx = Math.floor(index / 588);
    const medIdx = Math.floor((index % 588) / 28);
    const finalIdx = index % 28;

    const jamos: string[] = [];
    jamos.push(INITIAL_CONSONANTS[initIdx]);

    const medVowel = MEDIAL_VOWELS[medIdx];
    if (COMPOUND_VOWEL_SPLIT[medVowel]) {
      jamos.push(...COMPOUND_VOWEL_SPLIT[medVowel]);
    } else {
      jamos.push(medVowel);
    }

    if (finalIdx > 0) {
      const finalCons = FINAL_CONSONANTS[finalIdx];
      if (COMPOUND_BATCHIM_SPLIT[finalCons]) {
        jamos.push(...COMPOUND_BATCHIM_SPLIT[finalCons]);
      } else {
        jamos.push(finalCons);
      }
    }
    return jamos;
  }
  return [char];
}

export function composeJamosToHangul(jamoList: string[]): string {
  if (jamoList.length === 0) return '';
  if (jamoList.length === 1) return jamoList[0];

  const initJamo = jamoList[0];
  const initIdx = INITIAL_CONSONANTS.indexOf(initJamo);
  if (initIdx === -1) return jamoList.join('');

  let medJamo = jamoList[1];
  let medIdx = MEDIAL_VOWELS.indexOf(medJamo);
  let nextIdx = 2;

  if (jamoList.length >= 3) {
    for (const [compVowel, parts] of Object.entries(COMPOUND_VOWEL_SPLIT)) {
      if (parts[0] === jamoList[1] && parts[1] === jamoList[2]) {
        medJamo = compVowel;
        medIdx = MEDIAL_VOWELS.indexOf(compVowel);
        nextIdx = 3;
        break;
      }
    }
  }

  if (medIdx === -1) return jamoList.join('');

  let finalIdx = 0;
  if (jamoList.length > nextIdx) {
    const remaining = jamoList.slice(nextIdx);
    if (remaining.length === 1) {
      finalIdx = FINAL_CONSONANTS.indexOf(remaining[0]);
    } else if (remaining.length === 2) {
      for (const [compBatchim, parts] of Object.entries(COMPOUND_BATCHIM_SPLIT)) {
        if (parts[0] === remaining[0] && parts[1] === remaining[1]) {
          finalIdx = FINAL_CONSONANTS.indexOf(compBatchim);
          break;
        }
      }
      if (finalIdx <= 0) {
        finalIdx = FINAL_CONSONANTS.indexOf(remaining[0]);
      }
    }
  }

  if (finalIdx === -1) finalIdx = 0;

  const code = 0xAC00 + (initIdx * 588) + (medIdx * 28) + finalIdx;
  return String.fromCharCode(code);
}

export function decomposeTextToJamoSequence(text: string): { jamos: string[]; boundaries: { start: number; end: number }[] } {
  const jamos: string[] = [];
  const boundaries: { start: number; end: number }[] = [];

  let currentPos = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const decomposed = decomposeSyllableToJamo(char);
    const start = currentPos;
    jamos.push(...decomposed);
    currentPos += decomposed.length;
    boundaries.push({ start, end: currentPos });
  }

  return { jamos, boundaries };
}

export interface KeyDef {
  key: string;
  hangul: string;
  shiftHangul?: string;
  native: string;
  isHomeFinger?: boolean;
  isShiftKey?: boolean;
}

export const EXACT_TYPE_TODAY_ROWS: KeyDef[][] = [
  // Row 0: Number Row
  [
    { key: '1', hangul: '1', native: '' },
    { key: '2', hangul: '2', native: '' },
    { key: '3', hangul: '3', native: '' },
    { key: '4', hangul: '4', native: '' },
    { key: '5', hangul: '5', native: '' },
    { key: '6', hangul: '6', native: '' },
    { key: '7', hangul: '7', native: '' },
    { key: '8', hangul: '8', native: '' },
    { key: '9', hangul: '9', native: '' },
    { key: '0', hangul: '0', native: '' },
    { key: '-', hangul: '-', native: '' },
    { key: '=', hangul: '=', native: '' }
  ],
  // Row 1: Top QWERTY Row (with Shift Double Consonants & Compound Vowels)
  [
    { key: 'q', hangul: 'ㅂ', shiftHangul: 'ㅃ', native: 'Q' },
    { key: 'w', hangul: 'ㅈ', shiftHangul: 'ㅉ', native: 'W' },
    { key: 'e', hangul: 'ㄷ', shiftHangul: 'ㄸ', native: 'E' },
    { key: 'r', hangul: 'ㄱ', shiftHangul: 'ㄲ', native: 'R' },
    { key: 't', hangul: 'ㅅ', shiftHangul: 'ㅆ', native: 'T' },
    { key: 'y', hangul: 'ㅛ', native: 'Y' },
    { key: 'u', hangul: 'ㅕ', native: 'U' },
    { key: 'i', hangul: 'ㅑ', native: 'I' },
    { key: 'o', hangul: 'ㅐ', shiftHangul: 'ㅒ', native: 'O' },
    { key: 'p', hangul: 'ㅔ', shiftHangul: 'ㅖ', native: 'P' },
    { key: '[', hangul: '[', native: '' }
  ],
  // Row 2: Home Row (with Home Finger Guides on ㄹ/F and ㅓ/J)
  [
    { key: 'a', hangul: 'ㅁ', native: 'A' },
    { key: 's', hangul: 'ㄴ', native: 'S' },
    { key: 'd', hangul: 'ㅇ', native: 'D' },
    { key: 'f', hangul: 'ㄹ', native: 'F', isHomeFinger: true },
    { key: 'g', hangul: 'ㅎ', native: 'G' },
    { key: 'h', hangul: 'ㅗ', native: 'H' },
    { key: 'j', hangul: 'ㅓ', native: 'J', isHomeFinger: true },
    { key: 'k', hangul: 'ㅏ', native: 'K' },
    { key: 'l', hangul: 'ㅣ', native: 'L' },
    { key: ';', hangul: ';', native: '' }
  ],
  // Row 3: Bottom Row (with Left & Right Shift Keys)
  [
    { key: 'shift_left', hangul: '', native: '', isShiftKey: true },
    { key: 'z', hangul: 'ㅋ', native: 'Z' },
    { key: 'x', hangul: 'ㅌ', native: 'X' },
    { key: 'c', hangul: 'ㅊ', native: 'C' },
    { key: 'v', hangul: 'ㅍ', native: 'V' },
    { key: 'b', hangul: 'ㅠ', native: 'B' },
    { key: 'n', hangul: 'ㅜ', native: 'N' },
    { key: 'm', hangul: 'ㅡ', native: 'M' },
    { key: ',', hangul: ',', native: '' },
    { key: '.', hangul: '.', native: '' },
    { key: 'shift_right', hangul: '', native: '', isShiftKey: true }
  ]
];

// Basic Jamo Lessons
export const JAMO_LESSONS = [
  { target: 'ㄱ', meaning: '' },
  { target: 'ㄴ', meaning: '' },
  { target: 'ㄷ', meaning: '' },
  { target: 'ㄹ', meaning: '' },
  { target: 'ㅁ', meaning: '' },
  { target: 'ㅂ', meaning: '' },
  { target: 'ㅅ', meaning: '' },
  { target: 'ㅇ', meaning: '' },
  { target: 'ㅈ', meaning: '' },
  { target: 'ㅊ', meaning: '' },
  { target: 'ㅋ', meaning: '' },
  { target: 'ㅌ', meaning: '' },
  { target: 'ㅍ', meaning: '' },
  { target: 'ㅎ', meaning: '' },
  { target: 'ㅏ', meaning: '' },
  { target: 'ㅑ', meaning: '' },
  { target: 'ㅓ', meaning: '' },
  { target: 'ㅕ', meaning: '' },
  { target: 'ㅗ', meaning: '' },
  { target: 'ㅛ', meaning: '' },
  { target: 'ㅜ', meaning: '' },
  { target: 'ㅠ', meaning: '' },
  { target: 'ㅡ', meaning: '' },
  { target: 'ㅣ', meaning: '' },
  { target: 'ㅐ', meaning: '' },
  { target: 'ㅒ', meaning: '' },
  { target: 'ㅔ', meaning: '' },
  { target: 'ㅖ', meaning: '' }
];

// Sentences Lessons
export const SENTENCE_LESSONS = [
  { target: '안녕하세요', meaning: 'xin chào' },
  { target: '몇 시', meaning: 'mấy giờ / what time' },
  { target: '감사합니다', meaning: 'cảm ơn' },
  { target: '만나서 반갑습니다', meaning: 'rất vui được gặp bạn' },
  { target: '한국어를 공부하고 있어요', meaning: 'tôi đang học tiếng Hàn' },
  { target: '오늘 날씨가 정말 좋아요', meaning: 'thời tiết hôm nay rất đẹp' }
];
