export interface ExamQuestion {
  id: number;
  type: 'listening' | 'reading' | 'writing';
  section: string;
  audioUrl?: string;
  passage?: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  vocabulary: Array<{ kr: string; vi: string }>;
}

export interface ExamComment {
  id: string;
  author: string;
  avatarLetter: string;
  date: string;
  content: string;
}

export interface ExamSectionTag {
  name: string;
  count: number;
}

export interface TopikExamSuite {
  id: string;
  title: string;
  level: 'TOPIK I' | 'TOPIK II';
  type: 'Nghe' | 'Đọc' | 'Viết' | 'Đề Thi Thử Trọn Bộ';
  durationMinutes: number;
  totalQuestions: number;
  totalSections: number;
  participantsCount: number;
  commentsCount: number;
  description: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Thách thức';
  tag: string;
  listeningTags?: ExamSectionTag[];
  readingTags?: ExamSectionTag[];
  comments: ExamComment[];
  questions: ExamQuestion[];
}

export const TOPIK_EXAM_SUITES: TopikExamSuite[] = [
  {
    id: '35th-topik-1',
    title: '35th TOPIK I Mock Test',
    level: 'TOPIK I',
    type: 'Đề Thi Thử Trọn Bộ',
    durationMinutes: 100,
    totalQuestions: 70,
    totalSections: 2,
    participantsCount: 27774,
    commentsCount: 5,
    tag: '#TOPIK I',
    difficulty: 'Trung bình',
    description: 'Đề thi chính thức kỳ 35 TOPIK I bao gồm 30 câu Nghe và 40 câu Đọc hiểu kèm đáp án & lời giải chi tiết.',
    listeningTags: [
      { name: '#[TOPIK Listening] Chọn câu trả lời đúng', count: 6 },
      { name: '#[TOPIK Listening] Nối hội thoại', count: 4 },
      { name: '#[TOPIK Listening] Chọn nơi chốn', count: 4 },
      { name: '#[TOPIK Listening] Chọn chủ đề hội thoại', count: 6 },
      { name: '#[TOPIK Listening] Chọn tranh', count: 4 },
      { name: '#[TOPIK Listening] Nghe hội thoại dài', count: 6 }
    ],
    readingTags: [
      { name: '#[TOPIK Reading] Chọn chủ đề', count: 5 },
      { name: '#[TOPIK Reading] Điền từ vào chỗ trống', count: 8 },
      { name: '#[TOPIK Reading] Chọn đáp án sai', count: 5 },
      { name: '#[TOPIK Reading] Chọn thông tin đúng', count: 6 },
      { name: '#[TOPIK Reading] Chọn ý chính', count: 6 },
      { name: '#[TOPIK Reading] Sắp xếp câu theo thứ tự', count: 4 },
      { name: '#[TOPIK Reading] Đoạn văn dài', count: 6 }
    ],
    comments: [
      {
        id: 'c1',
        author: 'nguyenthiphuongthao2010.sd',
        avatarLetter: 'N',
        date: 'Tháng 12. 08, 2025',
        content: 'hihi đề này sát với đề thi thật lắm mọi người ơi'
      },
      {
        id: 'c2',
        author: 'phanmaithutrang2005.daosutich',
        avatarLetter: 'P',
        date: 'Tháng năm 07, 2025',
        content: 'khi nào làm xong hệ thống tính luôn điểm để mình biết trình độ TOPIK cấp mấy nha'
      },
      {
        id: 'c3',
        author: 'nhuphamicloud',
        avatarLetter: 'N',
        date: 'Tháng tư 20, 2025',
        content: 'khi nào bên LynKore có khóa luyện đề thi thử TOPIK tiếp theo ạ'
      },
      {
        id: 'c4',
        author: 'phuongnm404',
        avatarLetter: 'P',
        date: 'Tháng 12. 06, 2024',
        content: 'câu 34 có ảnh giống câu 33 ạ, với câu 29 mình chưa hiểu yêu cầu đề bài lắm =('
      },
      {
        id: 'c5',
        author: 'maitolinh0909',
        avatarLetter: 'M',
        date: 'Tháng bảy 20, 2025',
        content: '34 với 33 ảnh giống nhau, câu 29 là tìm câu tương ứng với mệnh đề có sẵn nha bạn'
      }
    ],
    questions: [
      {
        id: 1,
        type: 'reading',
        section: 'TOPIK I Reading - Tìm chủ đề của đoạn văn',
        passage: '저는 한국어 책을 읽습니다. 도서관에서 공부합니다.',
        questionText: '다음은 무엇에 대한 글입니까? (Đoạn văn trên nói về chủ đề gì?)',
        options: ['공부 (Học tập)', '쇼핑 (Mua sắm)', '운동 (Thể thao)', '여행 (Du lịch)'],
        correctAnswer: 0,
        explanation: 'Đoạn văn đề cập đến đọc sách tiếng Hàn và học ở thư viện, chủ đề chính là 공부 (Học tập).',
        vocabulary: [
          { kr: '책', vi: 'Sách' },
          { kr: '도서관', vi: 'Thư viện' },
          { kr: '공부하다', vi: 'Học tập' }
        ]
      },
      {
        id: 2,
        type: 'reading',
        section: 'TOPIK I Reading - Điền từ vào chỗ trống',
        questionText: '오늘 날씨가 매우 (      ). 바람이 불고 눈이 내립니다.',
        options: ['춥습니다 (Lạnh)', '따뜻합니다 (Ấm áp)', '덥습니다 (Nóng)', '복잡합니다 (Phức tạp)'],
        correctAnswer: 0,
        explanation: 'Có gió thổi và tuyết rơi nên tính từ phù hợp điền vào chỗ trống là 춥습니다 (Lạnh).',
        vocabulary: [
          { kr: '날씨', vi: 'Thời tiết' },
          { kr: '바람', vi: 'Gió' },
          { kr: '눈이 내리다', vi: 'Tuyết rơi' }
        ]
      },
      {
        id: 3,
        type: 'reading',
        section: 'TOPIK I Reading - Biển báo & Thông báo',
        passage: '[영업 시간: 09:00 ~ 21:00 / 매주 월요일 휴무]',
        questionText: '글의 내용과 같은 것을 고르십시오. (Chọn đáp án đúng với nội dung trên)',
        options: [
          '월요일에는 문을 열지 않습니다.',
          '오후 10시까지 영업합니다.',
          '아침 8시에 문을 엽니다.',
          '매일 làm việc không nghỉ.'
        ],
        correctAnswer: 0,
        explanation: '"매주 월요일 휴무" có nghĩa là nghỉ hàng tuần vào Thứ Hai. Đáp án 1 là chính xác.',
        vocabulary: [
          { kr: '영업 시간', vi: 'Giờ mở cửa' },
          { kr: '휴무', vi: 'Nghỉ bán' }
        ]
      },
      {
        id: 4,
        type: 'listening',
        section: 'TOPIK I Listening - Hội thoại ngắn',
        questionText: '가: 물을 마집합니까? / 나: (      )',
        options: [
          '네, 물을 마십니다.',
          '아니요, 물이 없습니다.',
          '네, 물을 사지 않습니다.',
          '아니요, 한국 사람입니다.'
        ],
        correctAnswer: 0,
        explanation: 'Câu hỏi nghi vấn "물을 마집합니까?" chọn câu trả lời "네, 물을 마십니다".',
        vocabulary: [
          { kr: '물', vi: 'Nước' },
          { kr: '마시다', vi: 'Uống' }
        ]
      }
    ]
  },
  {
    id: '36th-topik-1',
    title: '36th TOPIK I Mock Test',
    level: 'TOPIK I',
    type: 'Đề Thi Thử Trọn Bộ',
    durationMinutes: 100,
    totalQuestions: 70,
    totalSections: 2,
    participantsCount: 7719,
    commentsCount: 9,
    tag: '#TOPIK I',
    difficulty: 'Trung bình',
    description: 'Đề thi thử TOPIK I kỳ 36 gồm 30 câu Nghe và 40 câu Đọc hiểu chuẩn cấu trúc.',
    listeningTags: [
      { name: '#[TOPIK Listening] Chọn câu trả lời đúng', count: 6 },
      { name: '#[TOPIK Listening] Chọn nơi chốn', count: 4 }
    ],
    readingTags: [
      { name: '#[TOPIK Reading] Chọn chủ đề', count: 5 },
      { name: '#[TOPIK Reading] Điền từ vào chỗ trống', count: 8 }
    ],
    comments: [],
    questions: [
      {
        id: 1,
        type: 'reading',
        section: 'TOPIK I Reading - Ngữ pháp cơ bản',
        questionText: '저는 주말마다 친구와 함께 (      )에 갑니다.',
        options: ['영화관', '병원', '우체국', '은행'],
        correctAnswer: 0,
        explanation: 'Đi xem phim ở 영화관 (Rạp chiếu phim).',
        vocabulary: [{ kr: '영화관', vi: 'Rạp chiếu phim' }]
      }
    ]
  },
  {
    id: '37th-topik-1',
    title: '37th TOPIK I Mock Test',
    level: 'TOPIK I',
    type: 'Đề Thi Thử Trọn Bộ',
    durationMinutes: 100,
    totalQuestions: 70,
    totalSections: 2,
    participantsCount: 4668,
    commentsCount: 1,
    tag: '#TOPIK I',
    difficulty: 'Trung bình',
    description: 'Đề thi thử TOPIK I kỳ 37 tổng hợp ngữ pháp và từ vựng sơ cấp.',
    comments: [],
    questions: [
      {
        id: 1,
        type: 'reading',
        section: 'TOPIK I Reading',
        questionText: '한국어가 (      ) 재미있습니다.',
        options: ['어렵지만', '어려워서', '어려우면', '어렵게'],
        correctAnswer: 0,
        explanation: 'Vế tương phản: "Dù tiếng Hàn khó nhưng thú vị" (어렵지만).',
        vocabulary: [{ kr: '어렵다', vi: 'Khó' }]
      }
    ]
  },
  {
    id: '41st-topik-1',
    title: '41st TOPIK I Mock Test',
    level: 'TOPIK I',
    type: 'Đề Thi Thử Trọn Bộ',
    durationMinutes: 100,
    totalQuestions: 70,
    totalSections: 2,
    participantsCount: 3900,
    commentsCount: 2,
    tag: '#TOPIK I',
    difficulty: 'Trung bình',
    description: 'Đề thi chính thức TOPIK I kỳ 41 sát với xu hướng ra đề mới nhất.',
    comments: [],
    questions: [
      {
        id: 1,
        type: 'reading',
        section: 'TOPIK I Reading',
        questionText: '저는 내일 친구를 (      ) 합니다.',
        options: ['만나려고', '만나면', '만나서', '만나지만'],
        correctAnswer: 0,
        explanation: 'Cấu trúc dự định -(으)려고 하다: "Tôi định gặp bạn vào ngày mai".',
        vocabulary: [{ kr: '만나다', vi: 'Gặp gỡ' }]
      }
    ]
  },
  {
    id: '83rd-topik-2',
    title: '83rd TOPIK II Mock Test',
    level: 'TOPIK II',
    type: 'Đề Thi Thử Trọn Bộ',
    durationMinutes: 110,
    totalQuestions: 100,
    totalSections: 3,
    participantsCount: 12450,
    commentsCount: 14,
    tag: '#TOPIK II',
    difficulty: 'Thách thức',
    description: 'Đề thi thử TOPIK II kỳ 83 dành cho thí sinh ôn luyện Cấp 3 đến Cấp 6.',
    comments: [],
    questions: [
      {
        id: 1,
        type: 'reading',
        section: 'TOPIK II Reading - Ngữ pháp trung cấp',
        questionText: '지속적인 연습을 (      ) 실력이 향상될 수 없다.',
        options: ['하지 않고서는', '할 뿐만 아니라', '하더라도', '하자마자'],
        correctAnswer: 0,
        explanation: 'Cấu trúc "-지 않고서는 ... -ㄹ 수 없다": Nếu không làm X thì không thể Y.',
        vocabulary: [{ kr: '지속적', vi: 'Liên tục' }]
      }
    ]
  }
];

export interface ExamHistoryItem {
  id: string;
  suiteTitle: string;
  score: number;
  totalScore: number;
  percentage: number;
  passedLevel: string;
  date: string;
  timeSpentSec: number;
}
