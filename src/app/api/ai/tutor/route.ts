import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

function cleanJsonOutput(raw: string): string {
  if (!raw) return '';
  let clean = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // Try matching markdown code block ```json ... ``` or ``` ... ```
  const codeFenceMatch = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeFenceMatch && codeFenceMatch[1]) {
    clean = codeFenceMatch[1].trim();
  }

  // Find first { or [ and last } or ]
  const firstBrace = clean.search(/[\{\[]/);
  if (firstBrace !== -1) {
    const isObject = clean[firstBrace] === '{';
    const lastBrace = isObject ? clean.lastIndexOf('}') : clean.lastIndexOf(']');
    if (lastBrace !== -1 && lastBrace > firstBrace) {
      clean = clean.substring(firstBrace, lastBrace + 1);
    }
  }

  return clean;
}

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
    } else if (action === 'dict_lookup') {
      systemPrompt = 'Bạn là hệ thống từ điển Hàn-Việt chuẩn xác chuyên sâu. CHỈ xuất kết quả JSON Object chuẩn không kèm văn bản lập luận.';
      userPrompt = `Hãy tra cứu nghĩa của từ hoặc cụm từ: "${word}".
Yêu cầu phân biệt chuẩn xác sắc thái từ vựng:
- Nếu từ mang sắc thái chính thức, hành chính, văn bản hoặc kỹ thuật (ví dụ: 항공기, 차량): Ghi nghĩa là "Máy bay / Tàu bay (chính thức/chuyên ngành)" và xếp cấp độ "Trung cấp" hoặc "Cao cấp".
- Nếu từ thông dụng trong giao tiếp hằng ngày (ví dụ: 비행기, 차): Ghi nghĩa ngắn gọn "Máy bay", "Xe / Ô tô" và xếp cấp độ "Sơ cấp 1" hoặc "Sơ cấp 2".
- Nếu từ kính ngữ (ví dụ: 댁, 성함): Chú thích "(kính ngữ)".

Trả về dữ liệu dưới dạng JSON Object duy nhất với key "results" chứa danh sách từ 1 đến 3 kết quả từ điển:
{
  "results": [
    {
      "korean": "Từ tiếng Hàn",
      "hanja": "Gốc Hán nếu có hoặc rỗng",
      "vietnamese": "Nghĩa tiếng Việt chuẩn (chú thích sắc thái nếu có)",
      "type": "Danh từ / Động từ / Tính từ / Cụm từ",
      "level": "Sơ cấp 1 / Sơ cấp 2 / Trung cấp / Cao cấp",
      "pronunciation": "[phiên âm đọc]",
      "exampleKr": "Câu ví dụ tiếng Hàn thực tế",
      "exampleVi": "Dịch câu ví dụ tiếng Việt"
    }
  ]
}`;
    } else if (action === 'generate_sentences') {
      userPrompt = `Hãy đặt 3 câu ví dụ tiếng Hàn thực tế hoàn toàn mới chứa từ "${word}" (${vietnamese}).
Yêu cầu trả về định dạng JSON Object với key "results":
{
  "results": [
    {"kr": "Câu tiếng Hàn 1", "vi": "Dịch tiếng Việt 1"},
    {"kr": "Câu tiếng Hàn 2", "vi": "Dịch tiếng Việt 2"},
    {"kr": "Câu tiếng Hàn 3", "vi": "Dịch tiếng Việt 3"}
  ]
}`;
    } else if (action === 'chat') {
      userPrompt = `Người học đang học thẻ từ vựng: "${word}" (${vietnamese}).
Câu hỏi của người học: "${prompt}".
Hãy giải đáp ngắn gọn, chính xác và đưa ra lời khuyên thực tế để nhớ tốt hơn.`;
    } else {
      userPrompt = `Giải thích từ tiếng Hàn "${word}" cho người học tiếng Hàn Việt Nam.`;
    }

    const payload: any = {
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.5
    };

    if (action === 'dict_lookup' || action === 'generate_sentences') {
      payload.response_format = { type: 'json_object' };
    }

    let response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // Fallback retry without response_format if model failed json_object validation
    if (!response.ok && payload.response_format) {
      delete payload.response_format;
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API Status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content || 'Không nhận được phản hồi từ Trợ Lý AI.';
    
    if (action === 'dict_lookup' || action === 'generate_sentences') {
      reply = cleanJsonOutput(reply);
    } else {
      reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    }

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
