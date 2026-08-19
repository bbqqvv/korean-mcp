import { Deck, EmailLog, Flashcard } from './types';
import { supabase } from './supabase';
import fs from 'fs';
import path from 'path';

// Pre-seeded initial vocabulary datasets fallback
const INITIAL_DECKS: Deck[] = [
  {
    id: 'deck-places-work',
    title: 'Địa Điểm & Công Sở (Công ty, Thị trường)',
    description: 'Bộ từ vựng tiếng Hàn cơ bản về các địa điểm công cộng, văn phòng và cửa hàng.',
    category: 'Công sở & Địa điểm',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDailyReminder: true,
    cards: [
      {
        id: 'card-1',
        korean: '회사',
        pronunciation: 'hoe-sa',
        vietnamese: 'Công ty',
        hanja: '會社 (Hội xã)',
        exampleKr: '저는 내일 회사에 갑니다.',
        exampleVi: 'Ngày mai tôi đi đến công ty.',
        difficulty: 'easy',
        timesReviewed: 3
      },
      {
        id: 'card-2',
        korean: '식당',
        pronunciation: 'sik-dang',
        vietnamese: 'Nhà ăn / Nhà hàng',
        hanja: '食堂 (Thực đường)',
        exampleKr: '한국 식당에서 비빔밥을 먹어요.',
        exampleVi: 'Tôi ăn cơm trộn ở nhà hàng Hàn Quốc.',
        difficulty: 'medium',
        timesReviewed: 2
      },
      {
        id: 'card-3',
        korean: '가게',
        pronunciation: 'ga-ge',
        vietnamese: 'Cửa hàng / Tiệm',
        exampleKr: '가게에서 과일을 샀어요.',
        exampleVi: 'Tôi đã mua trái cây ở cửa hàng.',
        difficulty: 'easy',
        timesReviewed: 1
      },
      {
        id: 'card-4',
        korean: '마트',
        pronunciation: 'ma-teu',
        vietnamese: 'Siêu thị (Mart)',
        exampleKr: '주말에 마트에 장 보러 가요.',
        exampleVi: 'Cuối tuần tôi đi siêu thị mua đồ.',
        difficulty: 'easy',
        timesReviewed: 4
      },
      {
        id: 'card-5',
        korean: '시장',
        pronunciation: 'si-jang',
        vietnamese: 'Chợ',
        hanja: '市場 (Thị trường)',
        exampleKr: '전통 시장은 물건이 싸요.',
        exampleVi: 'Chợ truyền thống đồ đạc rất rẻ.',
        difficulty: 'medium',
        timesReviewed: 2
      },
      {
        id: 'card-6',
        korean: '약국',
        pronunciation: 'yak-guk',
        vietnamese: 'Hiệu thuốc',
        hanja: '藥局 (Dược cục)',
        exampleKr: '머리가 아파서 약국에 갔어요.',
        exampleVi: 'Vì đau đầu nên tôi đã đến hiệu thuốc.',
        difficulty: 'medium',
        timesReviewed: 1
      },
      {
        id: 'card-7',
        korean: '집',
        pronunciation: 'jip',
        vietnamese: 'Nhà',
        exampleKr: '퇴근하고 집으로 돌아갔습니다.',
        exampleVi: 'Tan làm xong tôi đã trở về nhà.',
        difficulty: 'easy',
        timesReviewed: 5
      },
      {
        id: 'card-8',
        korean: '아파트',
        pronunciation: 'a-pa-teu',
        vietnamese: 'Chung cư (Apartment)',
        exampleKr: '우리 집은 아파트 10층이에요.',
        exampleVi: 'Nhà tôi ở tầng 10 của chung cư.',
        difficulty: 'easy',
        timesReviewed: 2
      },
      {
        id: 'card-9',
        korean: '사무실',
        pronunciation: 'sa-mu-sil',
        vietnamese: 'Văn phòng',
        hanja: '事務室 (Sự vụ thất)',
        exampleKr: '사무실에서 회의를 하고 있습니다.',
        exampleVi: 'Chúng tôi đang họp trong văn phòng.',
        difficulty: 'medium',
        timesReviewed: 3
      }
    ]
  },
  {
    id: 'deck-house-rooms',
    title: 'Các Khu Vực & Vị Trí Trong Nhà',
    description: 'Các từ vựng về phòng ngủ, phòng khách, bếp và nhà vệ sinh.',
    category: 'Nhà cửa & Vật dụng',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDailyReminder: true,
    cards: [
      {
        id: 'card-10',
        korean: '침실',
        pronunciation: 'chim-sil',
        vietnamese: 'Phòng ngủ',
        hanja: '寢室 (Tẩm thất)',
        exampleKr: '침실에 큰 침대가 있어요.',
        exampleVi: 'Trong phòng ngủ có một chiếc giường lớn.',
        difficulty: 'easy',
        timesReviewed: 2
      },
      {
        id: 'card-11',
        korean: '거실',
        pronunciation: 'geo-sil',
        vietnamese: 'Phòng khách',
        hanja: '居室 (Cư thất)',
        exampleKr: '가족들이 거실에서 TV를 봐요.',
        exampleVi: 'Cả gia đình xem TV ở phòng khách.',
        difficulty: 'medium',
        timesReviewed: 1
      },
      {
        id: 'card-12',
        korean: '화장실',
        pronunciation: 'hwa-jang-sil',
        vietnamese: 'Nhà vệ sinh / Phòng tắm',
        hanja: '化妝室 (Hóa trang thất)',
        exampleKr: '화장실이 어디에 있나요?',
        exampleVi: 'Nhà vệ sinh ở đâu vậy ạ?',
        difficulty: 'easy',
        timesReviewed: 4
      },
      {
        id: 'card-13',
        korean: '부엌 / 주방',
        pronunciation: 'bu-eok / ju-bang',
        vietnamese: 'Khu bếp / Nhà bếp',
        hanja: '廚房 (Trù phòng)',
        exampleKr: '어머니께서 부엌에서 요리를 하십니다.',
        exampleVi: 'Mẹ tôi đang nấu ăn trong bếp.',
        difficulty: 'hard',
        timesReviewed: 1
      }
    ]
  }
];

let inMemoryStore: Deck[] | null = null;

export async function getDecksAsync(): Promise<Deck[]> {
  try {
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const decks: Deck[] = data.map((row: any) => ({
        id: row.id,
        title: row.title,
        category: row.category,
        description: row.description || '',
        youtubeUrl: row.youtube_url || undefined,
        cards: Array.isArray(row.cards) ? row.cards : [],
        createdAt: row.created_at || new Date().toISOString(),
        updatedAt: row.updated_at || new Date().toISOString(),
        isDailyReminder: row.is_daily_reminder ?? true
      }));
      inMemoryStore = decks;
      return decks;
    }
  } catch (err) {
    console.error('Supabase getDecksAsync error:', err);
  }

  if (inMemoryStore) return inMemoryStore;
  inMemoryStore = INITIAL_DECKS;
  return INITIAL_DECKS;
}

export async function getDeckByIdAsync(id: string): Promise<Deck | undefined> {
  try {
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      const deck: Deck = {
        id: data.id,
        title: data.title,
        category: data.category,
        description: data.description || '',
        youtubeUrl: data.youtube_url || undefined,
        cards: Array.isArray(data.cards) ? data.cards : [],
        createdAt: data.created_at || new Date().toISOString(),
        updatedAt: data.updated_at || new Date().toISOString(),
        isDailyReminder: data.is_daily_reminder ?? true
      };
      return deck;
    }
  } catch (err) {
    console.error('Supabase getDeckByIdAsync error:', err);
  }

  const decks = await getDecksAsync();
  return decks.find((d) => d.id === id);
}

export async function createNewDeckAsync(
  title: string,
  category: Deck['category'],
  description: string,
  youtubeUrl?: string,
  initialCards: Flashcard[] = []
): Promise<Deck> {
  const newDeck: Deck = {
    id: `deck-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title,
    category,
    description: description || `Bộ từ vựng tiếng Hàn tạo bởi Gemini Spark`,
    youtubeUrl,
    cards: initialCards,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDailyReminder: true
  };

  try {
    const { error } = await supabase.from('decks').insert({
      id: newDeck.id,
      title: newDeck.title,
      category: newDeck.category,
      description: newDeck.description,
      youtube_url: newDeck.youtubeUrl || null,
      cards: newDeck.cards,
      is_daily_reminder: newDeck.isDailyReminder
    });

    if (error) {
      console.error('Supabase insert deck error:', error);
    }
  } catch (err) {
    console.error('Supabase createNewDeckAsync exception:', err);
  }

  if (inMemoryStore) {
    inMemoryStore.unshift(newDeck);
  }

  return newDeck;
}

export async function saveDeckAsync(deck: Deck): Promise<Deck> {
  try {
    await supabase.from('decks').upsert({
      id: deck.id,
      title: deck.title,
      category: deck.category,
      description: deck.description,
      youtube_url: deck.youtubeUrl || null,
      cards: deck.cards,
      updated_at: new Date().toISOString()
    });
  } catch (err) {
    console.error('Supabase saveDeckAsync error:', err);
  }

  if (inMemoryStore) {
    const idx = inMemoryStore.findIndex((d) => d.id === deck.id);
    if (idx >= 0) inMemoryStore[idx] = deck;
    else inMemoryStore.unshift(deck);
  }

  return deck;
}

export async function addCardsToDeckAsync(deckId: string, cards: Flashcard[]): Promise<Deck | undefined> {
  const deck = await getDeckByIdAsync(deckId);
  if (!deck) return undefined;

  deck.cards.push(...cards);
  deck.updatedAt = new Date().toISOString();
  await saveDeckAsync(deck);
  return deck;
}

// Synchronous Legacy Fallbacks
export function getDecks(): Deck[] {
  return inMemoryStore || INITIAL_DECKS;
}

export function getDeckById(id: string): Deck | undefined {
  const decks = getDecks();
  return decks.find((d) => d.id === id);
}

export function saveDeck(deck: Deck): Deck {
  if (inMemoryStore) {
    const idx = inMemoryStore.findIndex((d) => d.id === deck.id);
    if (idx >= 0) inMemoryStore[idx] = deck;
    else inMemoryStore.unshift(deck);
  }
  saveDeckAsync(deck).catch(console.error);
  return deck;
}

export function addCardsToDeck(deckId: string, cards: Flashcard[]): Deck | undefined {
  const deck = getDeckById(deckId);
  if (!deck) return undefined;
  deck.cards.push(...cards);
  saveDeckAsync(deck).catch(console.error);
  return deck;
}

export function createNewDeck(
  title: string,
  category: Deck['category'],
  description: string,
  youtubeUrl?: string,
  initialCards: Flashcard[] = []
): Deck {
  const newDeck: Deck = {
    id: `deck-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title,
    category,
    description,
    youtubeUrl,
    cards: initialCards,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  createNewDeckAsync(title, category, description, youtubeUrl, initialCards).catch(console.error);
  return newDeck;
}

export function deleteDeck(id: string): boolean {
  if (inMemoryStore) {
    inMemoryStore = inMemoryStore.filter((d) => d.id !== id);
  }
  supabase.from('decks').delete().eq('id', id).then();
  return true;
}

export function getEmailLogs(): EmailLog[] {
  return [];
}

export function addEmailLog(log: Omit<EmailLog, 'id' | 'sentAt'>): EmailLog {
  return {
    ...log,
    id: `log-${Date.now()}`,
    sentAt: new Date().toISOString()
  };
}
