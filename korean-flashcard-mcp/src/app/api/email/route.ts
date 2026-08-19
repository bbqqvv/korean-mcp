import { NextResponse } from 'next/server';
import { addEmailLog, getEmailLogs, getDeckById, getDecks } from '@/lib/store';

export async function GET() {
  const logs = getEmailLogs();
  return NextResponse.json({ success: true, count: logs.length, logs });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { recipient, deckId, note } = body;

    if (!recipient) {
      return NextResponse.json({ success: false, error: 'Email người nhận là bắt buộc.' }, { status: 400 });
    }

    const decks = getDecks();
    const targetDeck = deckId ? getDeckById(deckId) : decks[0];

    if (!targetDeck) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy bộ từ vựng để gửi.' }, { status: 404 });
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const studyLink = `${protocol}://${host}/deck/${targetDeck.id}`;

    const log = addEmailLog({
      recipient,
      deckId: targetDeck.id,
      deckTitle: targetDeck.title,
      cardCount: targetDeck.cards.length,
      status: 'sent',
      note: note || 'Nhắc nhở học từ vựng tiếng Hàn hôm nay từ Gemini Spark!',
      previewUrl: studyLink
    });

    return NextResponse.json({
      success: true,
      message: `Đã gửi email nhắc học thành công tới ${recipient}!`,
      log,
      studyLink
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
