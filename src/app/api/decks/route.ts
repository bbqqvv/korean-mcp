import { NextResponse } from 'next/server';
import { getDecksAsync, createNewDeckAsync } from '@/lib/store';

export async function GET() {
  try {
    const decks = await getDecksAsync();
    return NextResponse.json({ success: true, count: decks.length, decks });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category = 'Giao tiếp hàng ngày', description = '', youtubeUrl, cards = [] } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: 'Tiêu đề bộ từ vựng là bắt buộc.' }, { status: 400 });
    }

    const newDeck = await createNewDeckAsync(title, category, description, youtubeUrl, cards);
    return NextResponse.json({ success: true, deck: newDeck });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
