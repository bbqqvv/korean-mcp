# 🇰🇷 HanVocab MCP - Korean Flashcard Learning Web App

Ứng dụng Học Từ Vựng Tiếng Hàn Flashcard 3D chuẩn **Apple iOS Dark/Light Glassmorphism**, tích hợp **Model Context Protocol (MCP Server)** cho phép **Gemini / Gemini Spark** kết nối trực tiếp và đồng bộ bài học tự động.

---

### ✨ Tính Năng Nổi Bật

- **Giao Diện Apple iOS Glassmorphism**: Thiết kế tối giản, hiệu ứng kính mờ 3D lật thẻ mượt mà, hỗ trợ Responsive 100% trên Điện thoại và Máy tính.
- **Tích Hợp MCP Server Protocol (`/api/mcp`)**: Tương thích chuẩn JSON-RPC 2.0. Kết nối với Gemini Spark để Gemini tự động trích xuất từ vựng từ video YouTube và đẩy về website.
- **Trợ Lý Gia Sư Groq AI (`llama-3.3-70b-versatile`)**: Tích hợp trực tiếp trên từng thẻ Flashcard (`🤖 Hỏi AI`), hỗ trợ giải thích ngữ pháp, từ Hán Hàn, câu chia đuôi trang trọng / thân mật, sinh câu ví dụ mới và giải đáp thắc mắc.
- **Phát Âm Chuẩn Giọng Hàn (TTS 🔊)**: Tích hợp Web Speech API phát âm chuẩn từ vựng và câu ví dụ.
- **Chế Độ Ôn Luyện Quiz (`/quiz`)**: Bài tập trắc nghiệm củng cố ghi nhớ từ vựng.
- **Thanh Lọc Danh Mục Cuộn Ngang & Tìm Kiếm**: Tự động gom nhóm các Tag/Danh mục do Gemini Spark tạo ra, hỗ trợ tìm kiếm nhanh và mở rộng tới 100+ bộ từ vựng.

---

### 🚀 Cấu Hình Kết Nối Gemini Spark Qua MCP

1. Khởi chạy ứng dụng:
   ```bash
   npm install
   npm run dev -p 3001
   ```
2. Trên màn hình **Gemini Spark**, vào **Cài đặt Kỹ năng / Extensions / MCP Server Connectors**, thêm URL:
   ```text
   http://localhost:3001/api/mcp
   ```
3. Ra lệnh trực tiếp cho Gemini Spark:
   > *"Đây là link YouTube: https://www.youtube.com/watch?v=xxx. Hãy dùng MCP Tool create_vocab_deck trích xuất 6 từ vựng tiếng Hàn và đẩy lên website giúp tôi."*

---

### 🛠️ Công Nghệ Sử Dụng

- **Framework**: Next.js 15 (App Router, Turbopack, TypeScript)
- **Styling**: Vanilla CSS (Apple iOS Glass Tokens, Glassmorphism, Tailwind Utilities)
- **AI Integration**: Groq API (`llama-3.3-70b-versatile`)
- **Protocol**: MCP (Model Context Protocol JSON-RPC 2.0)
