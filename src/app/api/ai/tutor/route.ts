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
      systemPrompt = `Bạn là hệ thống từ điển Hàn-Việt chuẩn xác chuyên sâu. CHỈ xuất kết quả JSON Object chuẩn không kèm văn bản lập luận.
Tuân thủ nghiêm ngặt 10 QUY TẮC BẤT BIẾN (INVARIANT RULES):
1. QUY TẮC NGUỒN GỐC TỪ (ETYMOLOGY): Phân loại chính xác origin là "native_korean" (Từ thuần Hàn/고유어), "sino_korean" (Từ Hán-Hàn/한자어), hoặc "loanword" (Ngoại lai).
2. NẾU origin == "native_korean" (ví dụ: 모르다, 몰라요, 먹다, 가다, 보다, 알다, 집, 친구):
   - Tuyệt đối set hanja = null, hanjaExplanation = null, hanjaFamily = null. KHÔNG ĐƯỢC TỰ BỊA CHỮ HÁN NHƯ 不知 CHO 몰라요!
   - Cung cấp trường "lemma" là dạng từ gốc (ví dụ: 몰라요 -> lemma: "모르다") và "type": "Động từ (dạng chia)" hoặc "Tính từ (dạng chia)".
   - Cung cấp trường "relatedWords" (từ liên quan về nghĩa) với các từ đồng nghĩa/trái nghĩa thuần Hàn hoặc phổ thông (ví dụ cho 몰라요: 알다, 알지 못하다).
3. NẾU origin == "sino_korean" (ví dụ: 우주선, 항공기, 시간, 학생):
   - Cung cấp hanja (ví dụ: 宇宙船), hanjaExplanation (ví dụ: 宇宙 (Vũ trụ) + 船 (Thuyền/Tàu)) và hanjaFamily (mạng lưới từ họ hàng Hán-Hàn như 항공사, 항공권).
4. KHÔNG tự ý dán nhãn "(chuyên ngành)" cho các danh từ phổ thông (như 우주선, 잠수함). Chỉ dán nhãn "(chính thức/chuyên ngành)" khi từ thực sự mang tính hành chính/kỹ thuật chuyên sâu (như 항공기, 차량).
5. Nếu từ có nhiều nghĩa (ví dụ: 배 -> 1. Bụng, 2. Thuyền, 3. Quả lê), xuất danh sách ứng viên (candidates) kèm độ tin cậy confidence.
6. Giữ nguyên chính tả tiếng Hàn và khoảng cách (spacing).
7. Chuẩn hóa dạng chia động/tính từ về dạng nguyên thể (-다) trong trường "lemma".
8. Ưu tiên thói quen sử dụng tự nhiên của người bản xứ Hàn Quốc.
9. Dịch nghĩa tiếng Việt tự nhiên, chuẩn xác theo ngữ cảnh.
10. Luôn trả về cấu trúc JSON duy nhất.`;

      userPrompt = `Hãy tra cứu từ hoặc cụm từ: "${word}".
Trả về dữ liệu dưới dạng JSON Object duy nhất với key "results":
{
  "results": [
    {
      "korean": "Từ tiếng Hàn (ví dụ: 몰라요)",
      "lemma": "Từ gốc nguyên thể (ví dụ: 모르다)",
      "origin": "native_korean / sino_korean / loanword",
      "hanja": "Gốc Hán nếu là sino_korean, nếu native_korean thì NULL",
      "hanjaExplanation": "Bóc tách âm Hán Việt nếu sino_korean, nếu native_korean thì NULL",
      "hanjaFamily": [
        {"korean": "Từ họ hàng Hán-Hàn 1", "vietnamese": "Nghĩa 1"}
      ],
      "relatedWords": [
        {"korean": "Từ liên quan về nghĩa 1", "vietnamese": "Nghĩa 1"}
      ],
      "vietnamese": "Nghĩa tiếng Việt tự nhiên (ví dụ: Tôi không biết)",
      "type": "Danh từ / Động từ / Động từ (dạng chia) / Tính từ",
      "level": "Sơ cấp 1 / Sơ cấp 2 / Trung cấp / Cao cấp",
      "pronunciation": "[phiên âm đọc]",
      "exampleKr": "Câu ví dụ tiếng Hàn thực tế",
      "exampleVi": "Dịch câu ví dụ tiếng Việt",
      "confidence": 0.98
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
