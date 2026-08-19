import { NextResponse } from 'next/server';
import { generateKoreanVocabWithGroq } from '@/lib/groq';
import { createNewDeck } from '@/lib/store';
import { Flashcard } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topicOrUrl, cardCount = 6 } = body;

    if (!topicOrUrl) {
      return NextResponse.json({ success: false, error: 'Chủ đề hoặc đường link YouTube là bắt buộc.' }, { status: 400 });
    }

    // Call Groq AI API
    const aiResult = await generateKoreanVocabWithGroq(topicOrUrl, Number(cardCount));

    const cards: Flashcard[] = aiResult.vocabulary.map((item, idx) => ({
      id: `card-groq-${Date.now()}-${idx}`,
      korean: item.korean,
      pronunciation: item.pronunciation,
      vietnamese: item.vietnamese,
      hanja: item.hanja || undefined,
      exampleKr: item.exampleKr || undefined,
      exampleVi: item.exampleVi || undefined,
      youtubeUrl: topicOrUrl.startsWith('http') ? topicOrUrl : undefined,
      difficulty: 'new',
      timesReviewed: 0
    }));

    // Create and persist deck
    const newDeck = createNewDeck(
      aiResult.title,
      aiResult.category,
      aiResult.description,
      topicOrUrl.startsWith('http') ? topicOrUrl : undefined,
      cards
    );

    return NextResponse.json({
      success: true,
      message: `Groq AI (llama-3.3-70b-versatile) đã tạo thành công bộ từ vựng "${newDeck.title}" với ${newDeck.cards.length} thẻ!`,
      deck: newDeck
    });
  } catch (err: any) {
    console.error('API /api/ai/generate error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Lỗi khi gọi Groq AI' },
      { status: 500 }
    );
  }
}
