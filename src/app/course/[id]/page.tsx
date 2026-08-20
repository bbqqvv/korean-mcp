'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import CreateDeckModal from '@/components/create-deck-modal';
import AITutorDrawer from '@/components/ai-tutor-drawer';
import { useTheme } from '@/lib/theme-context';
import { ArrowLeft, BookOpen, Layers, Play, CheckCircle2, Sparkles } from 'lucide-react';

import PDFWorkbookViewer from '@/components/pdf-workbook-viewer';

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
    <div className={`flex h-screen ${themeConfig.canvasBg} ${themeConfig.canvasText} overflow-hidden font-sans`}>
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <main className="relative flex flex-col h-full p-2 w-full max-w-full overflow-hidden">
          {/* PDF Digital Interactive Workbook Workspace */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <PDFWorkbookViewer
              courseId={id}
              courseTitle={course.title}
              courseCategory={course.category}
            />
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
