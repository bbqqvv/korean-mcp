/**
 * Korean Lemmatizer & Normalizer Utility
 * Converts conjugated Korean verbs/adjectives into base dictionary lemma form (원형).
 */

export interface NormalizationResult {
  normalized: string;
  original: string;
  isConjugated: boolean;
  explanation?: string;
  lemma?: string;
  origin?: 'native_korean' | 'sino_korean' | 'loanword';
}

const NATIVE_KOREAN_WORDS = new Set([
  '모르다', '몰라요', '알다', '먹다', '가다', '오다', '보다', '좋다', '싫다',
  '크다', '작다', '집', '친구', '사람', '우리', '나', '너', '엄마', '아빠',
  '하늘', '바람', '구름', '물', '불', '나무', '꽃', '새', '해', '달', '별'
]);

export function isNativeKorean(word: string): boolean {
  if (!word) return false;
  return NATIVE_KOREAN_WORDS.has(word.trim());
}

export function normalizeKoreanQuery(rawInput: string): NormalizationResult {
  if (!rawInput) {
    return { normalized: '', original: '', isConjugated: false };
  }

  let text = rawInput.trim();

  // Strip obvious noise / typo hangul characters at end (e.g., 비행기ㅣ -> 비행기)
  text = text.replace(/([가-힣])+[ㅣㅏㅓㅗㅜㅡㅡ]+$/g, '$1');

  // Common Verb/Adjective Conjugation Rules to Base Lemma (-다)
  const conjugationRules: Array<{ pattern: RegExp; replace: string; hint: string; lemmaOverride?: string }> = [
    // 모르다 -> 몰라요, 몰라
    { pattern: /^몰라(요|서|서요)?$/, replace: '모르다', hint: 'Động từ 모르다 (르 bất quy tắc)', lemmaOverride: '모르다' },

    // Past tense honorific / polite: -았어요 / -었어요 / -였습니다 / -했었어요
    { pattern: /(았|었|였)어요$/, replace: '다', hint: 'Thì quá khứ' },
    { pattern: /(았|었|였)습니다$/, replace: '다', hint: 'Thì quá khứ trang trọng' },
    { pattern: /(았|었|였)어$/, replace: '다', hint: 'Thì quá khứ thân mật' },

    // Present polite: -아요 / -어요 / -해요
    { pattern: /해요$/, replace: '하다', hint: 'Hiện tại đuôi 해요' },
    { pattern: /합니다$/, replace: '하다', hint: 'Hiện tại đuôi 합니다' },
    { pattern: /하십시오$/, replace: '하다', hint: 'Mệnh lệnh kính ngữ' },

    // Formal present: -ㅂ니다 / -습니다
    { pattern: /습니다$/, replace: '다', hint: 'Hiện tại trang trọng' },
    { pattern: /ㅂ니다$/, replace: '다', hint: 'Hiện tại trang trọng' },

    // Irregular verb handling:
    // 들어요 -> 듣다, 걸어요 -> 걷다, 물어요 -> 묻다 (ㄷ irregular)
    { pattern: /^들(어요|었|어)$/, replace: '듣다', hint: 'Bất quy tắc ㄷ (듣다)', lemmaOverride: '듣다' },
    { pattern: /^걸(어요|었|어)$/, replace: '걷다', hint: 'Bất quy tắc ㄷ (걷다)', lemmaOverride: '걷다' },
    { pattern: /^물(어요|었|어)$/, replace: '묻다', hint: 'Bất quy tắc ㄷ (묻다)', lemmaOverride: '묻다' },

    // 돕다 -> 도와요, 곱다 -> 고와요 (ㅂ irregular)
    { pattern: /^도와(요|서|서요)?$/, replace: '돕다', hint: 'Bất quy tắc ㅂ (돕다)', lemmaOverride: '돕다' },
    { pattern: /^고와(요|서)?$/, replace: '곱다', hint: 'Bất quy tắc ㅂ (곱다)', lemmaOverride: '곱다' },
    { pattern: /^추워(요|서)?$/, replace: '춥다', hint: 'Bất quy tắc ㅂ (춥다)', lemmaOverride: '춥다' },

    // 모르다 -> 몰라요, 빠르다 -> 빨라요 (르 irregular)
    { pattern: /^빨라(요|서)?$/, replace: '빠르다', hint: 'Bất quy tắc 르 (빠르다)', lemmaOverride: '빠르다' },
    { pattern: /^부올라(요)?$/, replace: '부르다', hint: 'Bất quy tắc 르 (부르다)', lemmaOverride: '부르다' },

    // Connective endings: -아서 / -어서 / -고 / -면 / -지만
    { pattern: /(아서|어서|여서)$/, replace: '다', hint: 'Đuôi nối nguyên nhân' },
    { pattern: /(고|지만|는데|은데)$/, replace: '다', hint: 'Đuôi liên kết' },
    { pattern: /(ㄹ|을)\s*수\s*있다$/, replace: '다', hint: 'Khả năng (thể nguyên thể)' }
  ];

  for (const rule of conjugationRules) {
    if (rule.pattern.test(text)) {
      const lemma = rule.lemmaOverride || text.replace(rule.pattern, rule.replace);
      const isNative = isNativeKorean(lemma) || isNativeKorean(text);
      return {
        normalized: lemma,
        original: text,
        lemma: lemma,
        isConjugated: true,
        origin: isNative ? 'native_korean' : undefined,
        explanation: `Đã dạng chia câu (${rule.hint}) về động/tính từ gốc: ${lemma}`
      };
    }
  }

  return {
    normalized: text,
    original: text,
    isConjugated: false,
    origin: isNativeKorean(text) ? 'native_korean' : undefined
  };
}
