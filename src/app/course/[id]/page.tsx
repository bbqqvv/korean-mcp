'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import CreateDeckModal from '@/components/create-deck-modal';
import AITutorDrawer from '@/components/ai-tutor-drawer';
import { useTheme } from '@/lib/theme-context';
import { ArrowLeft, BookOpen, Layers, Play, CheckCircle2, Sparkles } from 'lucide-react';

interface CoursePageProps {
  params: Promise<{ id: string }>;
}

const COURSE_DETAILS: Record<string, { title: string; subtitle: string; category: string; description: string; chapters: Array<{ title: string; count: number; desc: string }> }> = {
  'so-cap-1': {
    title: 'TOPIK 1 - Tiếng Hàn Sơ Cấp 1',
    subtitle: 'Giáo trình Tiếng Hàn Màu Xanh Lá cho người Việt',
    category: 'Sơ cấp (Level 1)',
    description: 'Bộ giáo trình xây dựng nền tảng từ vựng cơ bản, chữ cái Hangeul, các câu giao tiếp sinh hoạt và từ vựng thông dụng.',
    chapters: [
      { title: 'Bài 1: Giới thiệu bản thân & Quốc tịch', count: 15, desc: 'Từ vựng quốc gia, nghề nghiệp và cấu trúc 입니다 / 이/가 아닙니다' },
      { title: 'Bài 2: Trường học & Đồ dùng học tập', count: 18, desc: 'Tên môn học, vị trí phòng học và cấu trúc 이에요/예요' },
      { title: 'Bài 3: Mua sắm & Giá cả', count: 20, desc: 'Từ vựng hoa quả, đồ vật sinh hoạt, đơn vị đếm và cách hỏi giá 얼마예요' },
      { title: 'Bài 4: Sinh hoạt hằng ngày & Thời gian', count: 22, desc: 'Động từ sinh hoạt, thời gian giờ phút và chia đuôi -아/어/해요' }
    ]
  },
  'so-cap-2': {
    title: 'TOPIK 2 - Tiếng Hàn Sơ Cấp 2',
    subtitle: 'Giáo trình Tiếng Hàn Màu Xanh Lá cho người Việt',
    category: 'Sơ cấp (Level 2)',
    description: 'Nâng cao vốn từ vựng giao tiếp, mua sắm, đặt phòng, hò hẹn, du lịch và miêu tả thời tiết.',
    chapters: [
      { title: 'Bài 1: Giao thông & Phương tiện', count: 18, desc: 'Tên xe buýt, tàu điện ngầm, vị trí trạm xe và cấu trúc 타고 가다' },
      { title: 'Bài 2: Gọi điện thoại & Lịch trình', count: 16, desc: 'Số điện thoại, quy tắc nghe máy và từ vựng hẹn gặp' },
      { title: 'Bài 3: Thời tiết & Mùa', count: 20, desc: 'Bốn mùa Xuân Hạ Thu Đông, tính từ miêu tả thời tiết' },
      { title: 'Bài 4: Sở thích & Thể thao', count: 25, desc: 'Các môn thể thao, nhạc cụ và các từ vựng giải trí' }
    ]
  },
  'seoul-1': {
    title: 'Tiếng Hàn Màu Sắc - Seoul Book 1',
    subtitle: 'Bộ giáo trình chuẩn Seoul National University Level 1',
    category: 'Seoul Book 1',
    description: 'Bộ sách tiếng Hàn Màu Sắc nổi tiếng với phương pháp học hình ảnh sinh động dành cho người bắt đầu.',
    chapters: [
      { title: 'Chapter 1: Chữ cái Hangeul & Nguyên âm', count: 24, desc: 'Nhận biết bảng chữ cái và ghép âm chuẩn xác' },
      { title: 'Chapter 2: Chào hỏi & Xưng hô', count: 16, desc: 'Các mẫu câu chào hỏi hàng ngày 안녕하십니까' },
      { title: 'Chapter 3: Địa điểm & Cửa hàng', count: 20, desc: 'Nhà hàng, quán cafe, ngân hàng và trạm xe' }
    ]
  }
};

export default function CourseDetailPage({ params }: CoursePageProps) {
  const { id } = use(params);
  const { themeConfig } = useTheme();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);

  const course = COURSE_DETAILS[id] || {
    title: `Giáo trình Tiếng Hàn: ${id.toUpperCase()}`,
    subtitle: 'Bộ sách học tiếng Hàn bài bản dành cho người Việt',
    category: 'Giáo trình chuẩn',
    description: 'Nội dung chi tiết của cuốn sách bao gồm đầy đủ bài học từ vựng, ví dụ câu và bài tập thực hành.',
    chapters: [
      { title: 'Bài 1: Từ vựng nền tảng', count: 15, desc: 'Các từ vựng cốt lõi thường gặp trong bài kiểm tra TOPIK' },
      { title: 'Bài 2: Mẫu câu ứng dụng', count: 18, desc: 'Các ví dụ thực tế ứng dụng trong đời sống Hàn Quốc' }
    ]
  };

  return (
    <div className="flex h-screen bg-[#faf8f5] text-slate-900 overflow-hidden font-sans p-2.5 sm:p-4 gap-3 sm:gap-4">
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-caro-grid border-2 border-slate-900 rounded-3xl relative shadow-xs">
        <main className="relative flex flex-col gap-6 min-h-[calc(98vh-24px)] px-4 lg:px-8 py-8 max-w-[1215px] mx-auto w-full overflow-y-auto pb-28 md:pb-12">
          {/* Back button */}
          <div>
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Danh Mục Sách</span>
            </Link>
          </div>

          {/* Course Banner */}
          <div className="bg-secondary-background border-2 border-border rounded-base shadow-shadow p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-heading text-rose-600 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>{course.category}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading text-slate-900 leading-tight">
              {course.title}
            </h1>
            <p className="text-sm font-medium text-slate-600">
              {course.subtitle}
            </p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
              {course.description}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 bg-main text-main-foreground px-5 py-2.5 rounded-base border-2 border-border font-heading text-xs sm:text-sm shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Lật Bài Thẻ Flashcard</span>
              </Link>
            </div>
          </div>

          {/* Chapter List */}
          <div className="space-y-3">
            <h2 className="text-xl font-heading text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Danh Sách Chương Bài Học ({course.chapters.length} chương)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.chapters.map((ch, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-border rounded-base shadow-shadow p-4 space-y-2 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Chương {idx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {ch.count} từ vựng
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{ch.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{ch.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <CreateDeckModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {isAITutorOpen && (
        <AITutorDrawer
          card={{
            id: 'card-default',
            korean: '한국어',
            pronunciation: 'han-guk-eo',
            vietnamese: 'Tiếng Hàn Quốc'
          }}
          isOpen={isAITutorOpen}
          onClose={() => setIsAITutorOpen(false)}
        />
      )}
    </div>
  );
}
