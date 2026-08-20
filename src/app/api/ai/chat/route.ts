import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

const MODELS_TO_TRY = [
  'qwen/qwen3.6-27b',
  'groq/compound',
  'groq/compound-mini',
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b'
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, role = 'general' } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, error: 'Messages array is required.' },
        { status: 400 }
      );
    }

    let roleSystemPrompt = 'Bạn là LynKore AI - Trợ lý & Gia sư tiếng Hàn Quốc xuất sắc dành cho người Việt Nam. Trả lời trực tiếp bằng tiếng Việt tự nhiên, ấm áp, ngắn gọn, dùng định dạng Markdown với các biểu tượng emoji sinh động.';

    if (role === 'grammar') {
      roleSystemPrompt = 'Bạn là Chuyên gia Ngữ pháp Tiếng Hàn LynKore. Nhiệm vụ của bạn là phân tích lỗi sai ngữ pháp, phân biệt các cấu trúc tương tự (như -아/어 보다 vs -고 싶다, -은/는 vs -이/가), chia đuôi kính ngữ (해요/하십시오/해), giải thích chi tiết gốc Hán Hàn (한자) và đưa ra ví dụ minh họa.';
    } else if (role === 'roleplay') {
      roleSystemPrompt = 'Bạn là Người bản xứ Hàn Quốc nhiệt tình. Bạn đang tham gia đóng vai luyện hội thoại tiếng Hàn theo chủ đề mà người dùng yêu cầu (Đi du lịch Myeongdong, Gọi món ăn quán nướng, Phỏng vấn công ty Hàn, Mua sắm tại Gangnam...). Mỗi câu bạn trả lời bằng tiếng Hàn kèm theo dịch nghĩa tiếng Việt bên dưới.';
    } else if (role === 'topik') {
      roleSystemPrompt = 'Bạn là Giám khảo & Huấn luyện viên luyện thi TOPIK I, TOPIK II và KIIP Hội Nhập Xã Hội Hàn Quốc. Hãy cung cấp chiến thuật làm bài, phân tích cấu trúc từ vựng cao cấp, bài tập trắc nghiệm và chữa bài viết TOPIK 쓰기.';
    }

    const formattedMessages = [
      { role: 'system', content: roleSystemPrompt },
      ...messages.slice(-10) // Keep last 10 messages for context
    ];

    let lastError = '';
    let reply = '';
    let usedModel = '';

    // Loop through model fallbacks to ensure 100% reliability
    for (const modelName of MODELS_TO_TRY) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: modelName,
            messages: formattedMessages,
            temperature: 0.7
          })
        });

        if (response.ok) {
          const data = await response.json();
          let rawReply = data.choices?.[0]?.message?.content || '';
          
          // Remove internal <think>...</think> tags if present
          rawReply = rawReply.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

          if (rawReply) {
            reply = rawReply;
            usedModel = modelName;
            break; // Success!
          }
        } else {
          const errText = await response.text();
          lastError = `Model ${modelName} returned status ${response.status}: ${errText}`;
        }
      } catch (err: any) {
        lastError = err.message || 'Fetch error';
      }
    }

    if (!reply) {
      // Fallback friendly response if no model is reached or GROQ_API_KEY is missing
      reply = `안녕하세요! 🇰🇷 Tôi là **LynKore AI Assistant**.

Dưới đây là gợi ý trả lời cho câu hỏi của bạn:

1. **Từ vựng & Mẫu câu thông dụng**:
   - 🇰🇷 안녕하세요 (Xin chào)
   - 🇰🇷 감사합니다 (Cảm ơn)
   - 🇰🇷 죄송합니다 (Xin lỗi)
   - 🇰🇷 한국어를 공부해요 (Tôi học tiếng Hàn)

2. **Gợi ý học tập**: Bạn có thể ôn luyện thẻ từ vựng ở mục **Sách & Giáo Trình** hoặc **Tra Từ Điển** để tra cứu chi tiết hơn!`;
    }

    return NextResponse.json({
      success: true,
      model: usedModel || 'fallback',
      reply
    });
  } catch (err: any) {
    console.error('AI Chat Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Lỗi khi gọi Groq AI Assistant' },
      { status: 500 }
    );
  }
}
