import { Flashcard, Deck } from './types';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

export interface AIGeneratedDeckResult {
  title: string;
  category: Deck['category'];
  description: string;
  vocabulary: Array<{
    korean: string;
    pronunciation: string;
    vietnamese: string;
    hanja?: string;
    exampleKr?: string;
    exampleVi?: string;
  }>;
}

export async function generateKoreanVocabWithGroq(
  topicOrUrl: string,
  cardCount: number = 6
): Promise<AIGeneratedDeckResult> {
  const prompt = `Bạn là chuyên gia dạy tiếng Hàn Quốc cho người Việt Nam. 
Hãy phân tích chủ đề hoặc đường link YouTube sau đây: "${topicOrUrl}".
Hãy tạo chính xác ${cardCount} từ vựng tiếng Hàn quan trọng và thực tế nhất liên quan tới chủ đề này.

Yêu cầu trả về kết quả ở định dạng chuẩn JSON duy nhất theo cấu trúc sau (không kèm markdown format ngoài JSON):
{
  "title": "Tiêu đề bộ từ vựng ngắn gọn, hấp dẫn",
  "category": "Một trong các danh mục: Công sở & Địa điểm | Nhà cửa & Vật dụng | YouTube Video | Giao tiếp hàng ngày | Nâng cao",
  "description": "Mô tả ngắn 1 câu về nội dung bộ từ vựng",
  "vocabulary": [
    {
      "korean": "Từ tiếng Hàn (VD: 회사)",
      "pronunciation": "Phiên âm Romaja/phát âm (VD: hoe-sa)",
      "vietnamese": "Nghĩa tiếng Việt chuẩn",
      "hanja": "Gốc từ Hán Hàn nếu có (VD: 會社 - Hội xã), nếu không có thì để rỗng",
      "exampleKr": "Câu ví dụ thực tế bằng tiếng Hàn ngắn gọn",
      "exampleVi": "Nghĩa tiếng Việt của câu ví dụ"
    }
  ]
}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful JSON generator assistant specialized in Korean language education for Vietnamese learners. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API returned status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const contentText = data.choices?.[0]?.message?.content || '{}';
    const parsed: AIGeneratedDeckResult = JSON.parse(contentText);

    return {
      title: parsed.title || `Bộ từ vựng: ${topicOrUrl}`,
      category: parsed.category || 'Giao tiếp hàng ngày',
      description: parsed.description || `Được tạo tự động bởi Groq AI (${GROQ_MODEL})`,
      vocabulary: parsed.vocabulary || []
    };
  } catch (error) {
    console.error('Groq AI Error:', error);
    throw error;
  }
}
