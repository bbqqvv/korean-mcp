export interface Flashcard {
  id: string;
  korean: string;
  pronunciation: string; // Romaja / Phiên âm
  vietnamese: string;
  hanja?: string; // Từ Hán Hàn (nếu có)
  exampleKr?: string;
  exampleVi?: string;
  youtubeUrl?: string;
  timestampStart?: number; // Giây trong clip Youtube
  difficulty?: 'new' | 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
  timesReviewed?: number;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  category: 'Công sở & Địa điểm' | 'Nhà cửa & Vật dụng' | 'YouTube Video' | 'Giao tiếp hàng ngày' | 'Nâng cao';
  youtubeUrl?: string;
  cards: Flashcard[];
  createdAt: string;
  updatedAt: string;
  isDailyReminder?: boolean;
}

export interface EmailLog {
  id: string;
  sentAt: string;
  recipient: string;
  deckId: string;
  deckTitle: string;
  cardCount: number;
  status: 'sent' | 'failed' | 'scheduled';
  note?: string;
  previewUrl?: string;
}

export interface MCPToolResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
}
