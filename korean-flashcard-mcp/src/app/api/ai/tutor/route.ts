import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, word, vietnamese, prompt, context } = body;

    if (!word) {
      return NextResponse.json({ success: false, error: 'Từ tiếng Hàn (word) là bắt buộc.' }, { status: 400 });
    }

    let systemPrompt = 'Bạn là gia sư tiếng Hàn Quốc xuất sắc, am hiểu tâm lý người học Việt Nam. Hãy trả lời ngắn gọn, súc tích, dễ hiểu bằng tiếng Việt.';
    let userPrompt = '';

    if (action === 'explain') {
      userPrompt = `Hãy giải thích chi tiết từ tiếng Hàn "${word}" (Nghĩa: ${vietnamese || ''}):
1. **Phân tích ngữ pháp & Ngữ cảnh sử dụng**: Khi nào dùng từ này? Có chia đuôi câu trang trọng / thân mật như thế nào? (Ví dụ: 배우다 -> 배웠어요 / 배우겠습니다).
2. **Gốc từ Hán Hàn (nếu có)** hoặc Mẹo ghi nhớ nhanh.
3. **Phân biệt với từ đồng nghĩa** (Ví dụ phân biệt với từ tương tự nếu có).
4. **3 Câu ví dụ thực tế nhất** kèm dịch nghĩa tiếng Việt.`;
    } else if (action === 'generate_sentences') {
      userPrompt = `Hãy đặt 3 câu ví dụ tiếng Hàn thực tế hoàn toàn mới chứa từ "${word}" (${vietnamese}).
Yêu cầu trả về định dạng JSON duy nhất dạng array:
[
  {"kr": "Câu tiếng Hàn 1", "vi": "Dịch tiếng Việt 1"},
  {"kr": "Câu tiếng Hàn 2", "vi": "Dịch tiếng Việt 2"},
  {"kr": "Câu tiếng Hàn 3", "vi": "Dịch tiếng Việt 3"}
]`;
    } else if (action === 'chat') {
      userPrompt = `Người học đang học thẻ từ vựng: "${word}" (${vietnamese}).
Câu hỏi của người học: "${prompt}".
Hãy giải đáp ngắn gọn, chính xác và đưa ra lời khuyên thực tế để nhớ tốt hơn.`;
    } else {
      userPrompt = `Giải thích từ tiếng Hàn "${word}" cho người học tiếng Hàn Việt Nam.`;
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API Status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Không nhận được phản hồi từ Groq AI.';

    return NextResponse.json({
      success: true,
      model: GROQ_MODEL,
      reply
    });
  } catch (err: any) {
    console.error('Groq AI Tutor Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Lỗi khi gọi Groq AI Tutor' },
      { status: 500 }
    );
  }
}
