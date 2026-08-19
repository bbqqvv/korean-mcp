import { NextResponse } from 'next/server';
import { getDeckByIdAsync, saveDeckAsync, deleteDeck } from '@/lib/store';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deck = await getDeckByIdAsync(id);
  if (!deck) {
    return NextResponse.json({ success: false, error: 'Không tìm thấy bộ từ vựng.' }, { status: 404 });
  }
  return NextResponse.json({ success: true, deck });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const existing = await getDeckByIdAsync(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy bộ từ vựng.' }, { status: 404 });
    }

    const updated = await saveDeckAsync({
      ...existing,
      ...body,
      id: existing.id,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, deck: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = deleteDeck(id);
  if (!deleted) {
    return NextResponse.json({ success: false, error: 'Không tìm thấy bộ từ vựng để xóa.' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Đã xóa bộ từ vựng thành công.' });
}
