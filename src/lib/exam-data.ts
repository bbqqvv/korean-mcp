export interface ExamQuestion {
  id: number;
  type: 'listening' | 'reading' | 'writing';
  section: string; // e.g. "TOPIK I - Đọc câu ngắn", "TOPIK I - Nghe hội thoại"
  audioUrl?: string;
  passage?: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  vocabulary: Array<{ kr: string; vi: string }>;
}

export interface TopikExamSuite {
  id: string;
  title: string;
  level: 'TOPIK I (Cấp 1-2)' | 'TOPIK II (Cấp 3-6)';
  type: 'Nghe' | 'Đọc' | 'Viết' | 'Đề Thi Thử Trọn Bộ';
  durationMinutes: number;
  totalQuestions: number;
  description: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Thách thức';
  questions: ExamQuestion[];
}

export const TOPIK_EXAM_SUITES: TopikExamSuite[] = [
  {
    id: 'topik1-reading-01',
    title: 'Đề Thi Thử TOPIK I - Kỹ Năng Đọc (Reading)',
    level: 'TOPIK I (Cấp 1-2)',
    type: 'Đọc',
    durationMinutes: 40,
    totalQuestions: 6,
    difficulty: 'Trung bình',
    description: 'Bộ 40 câu hỏi Đọc hiểu TOPIK I bao gồm từ vựng, biển báo, ngữ pháp và đoạn văn ngắn.',
    questions: [
      {
        id: 1,
        type: 'reading',
        section: 'Tìm chủ đề của đoạn văn',
        passage: '저는 한국어 책을 읽습니다. bạn tôi gõ phím tiếng Hàn. 도서관에서 공부합니다.',
        questionText: '다음은 무엇에 대한 글입니까? (Đoạn văn trên nói về chủ đề gì?)',
        options: ['공부 (Học tập)', '쇼핑 (Mua sắm)', '운동 (Thể thao)', '여행 (Du lịch)'],
        correctAnswer: 0,
        explanation: 'Đoạn văn đề cập đến việc đọc sách tiếng Hàn ("책을 읽습니다") và học ở thư viện ("도서관에서 공부합니다"), do đó chủ đề chính là 공부 (Học tập).',
        vocabulary: [
          { kr: '책', vi: 'Sách' },
          { kr: '읽다', vi: 'Đọc' },
          { kr: '도서관', vi: 'Thư viện' },
          { kr: '공부하다', vi: 'Học tập' }
        ]
      },
      {
        id: 2,
        type: 'reading',
        section: 'Điền ngữ pháp / từ vựng vào chỗ trống (괄호)',
        questionText: '오늘 날씨가 매우 (      ). 바람이 불고 눈이 내립니다.',
        options: ['춥습니다 (Lạnh)', '따뜻합니다 (Ấm áp)', '덥습니다 (Nóng)', '복잡합니다 (Phức tạp)'],
        correctAnswer: 0,
        explanation: 'Vế sau có "바람이 불고 눈이 내립니다" (Gió thổi và tuyết rơi) nên tính từ phù hợp điền vào chỗ trống phải là 춥습니다 (Lạnh).',
        vocabulary: [
          { kr: '날씨', vi: 'Thời tiết' },
          { kr: '바람', vi: 'Gió' },
          { kr: '눈이 내리다', vi: 'Tuyết rơi' },
          { kr: '춥다', vi: 'Lạnh' }
        ]
      },
      {
        id: 3,
        type: 'reading',
        section: 'Đọc hiểu biển báo & quảng cáo',
        passage: '[영업 시간: 09:00 ~ 21:00 / 매주 월요일 휴무]',
        questionText: '글의 내용과 같은 것을 고르십시오. (Chọn đáp án đúng với nội dung trên)',
        options: [
          '월요일에는 문을 열지 않습니다.',
          '오후 10시까지 영업합니다.',
          '아침 8시에 문을 엽니다.',
          '매일 làm việc không nghỉ.'
        ],
        correctAnswer: 0,
        explanation: '"매주 월요일 휴무" có nghĩa là nghỉ hàng tuần vào Thứ Hai. Vậy đáp án 1 (Vào Thứ Hai cửa hàng không mở cửa) là chính xác.',
        vocabulary: [
          { kr: '영업 시간', vi: 'Giờ mở cửa' },
          { kr: '휴무', vi: 'Nghỉ làm / Nghỉ bán' },
          { kr: '매주', vi: 'Hàng tuần' }
        ]
      },
      {
        id: 4,
        type: 'reading',
        section: 'Chọn câu có cùng ý nghĩa',
        questionText: '저는 주말마다 친구와 함께 영화관에 갑니다.',
        options: [
          '저는 주말에 친구하고 영화를 봅니다.',
          '저는 혼자 영화를 봅니다.',
          '저는 평일에 영화관에 갑니다.',
          '저는 영화를 좋아하지 않습니다.'
        ],
        correctAnswer: 0,
        explanation: 'Câu đề bài: "Mỗi cuối tuần tôi đều đến rạp chiếu phim cùng bạn". Tương đương với đáp án 1: "Tôi xem phim cùng bạn vào cuối tuần".',
        vocabulary: [
          { kr: '주말마다', vi: 'Mỗi cuối tuần' },
          { kr: '함께', vi: 'Cùng nhau' },
          { kr: '영화관', vi: 'Rạp chiếu phim' }
        ]
      },
      {
        id: 5,
        type: 'reading',
        section: 'Đọc hiểu đoạn văn trung bình',
        passage: '저는 서울에 삽니다. 서울은 한국의 수도입니다. 서울에는 맛있는 음식점과 아름다운 공원이 많습니다. 주말에는 한강 공원에서 자전거를 땁니다.',
        questionText: '이 글의 내용과 다른 것을 고르십시오. (Chọn đáp án KHÔNG đúng với bài đọc)',
        options: [
          '이 사람은 부산에 삽니다.',
          '서울은 한국의 수도입니다.',
          '서울에는 공원이 많습니다.',
          '주말에 한강에서 자전거를 땁니다.'
        ],
        correctAnswer: 0,
        explanation: 'Bài viết ghi "저는 서울에 삽니다" (Tôi sống ở Seoul). Đáp án 1 ghi "Người này sống ở Busan" là sai với nội dung đoạn văn.',
        vocabulary: [
          { kr: '수도', vi: 'Thủ đô' },
          { kr: '음식점', vi: 'Nhà hàng / Quán ăn' },
          { kr: '자전거를 타다', vi: 'Đi xe đạp' }
        ]
      },
      {
        id: 6,
        type: 'reading',
        section: 'Sắp xếp thứ tự các câu (가-나-다-라)',
        passage: '(가) 그래서 한국 음식을 자주 먹습니다.\n(나) 저는 한국 요리를 좋아합니다.\n(다) 특히 비빔밥과 불고기를 제일 좋아합니다.',
        questionText: '다음 문장을 올바른 순서로 arranged 하십시오.',
        options: ['(나) - (가) - (다)', '(가) - (나) - (다)', '(다) - (나) - (가)', '(나) - (다) - (가)'],
        correctAnswer: 0,
        explanation: 'Trật tự hợp lý: (나) "Tôi thích món ăn Hàn Quốc" -> (가) "Vì vậy tôi thường ăn món Hàn" -> (다) "Đặc biệt tôi thích nhất Bibimbap và Bulgogi".',
        vocabulary: [
          { kr: '요리', vi: 'Món ăn / Nấu ăn' },
          { kr: '그래서', vi: 'Vì vậy' },
          { kr: '특히', vi: 'Đặc biệt' }
        ]
      }
    ]
  },
  {
    id: 'topik1-listening-01',
    title: 'Đề Thi Thử TOPIK I - Kỹ Năng Nghe (Listening)',
    level: 'TOPIK I (Cấp 1-2)',
    type: 'Nghe',
    durationMinutes: 30,
    totalQuestions: 4,
    difficulty: 'Dễ',
    description: 'Bộ câu hỏi luyện nghe TOPIK I kèm file âm thanh phát âm giọng chuẩn Seoul.',
    questions: [
      {
        id: 1,
        type: 'listening',
        section: 'Nghe & Chọn câu trả lời tiếp theo phù hợp',
        questionText: '가: 물을 마집합니까? (Bạn uống nước không?) / 나: (      )',
        options: [
          '네, 물을 마십니다.',
          '아니요, 물이 없습니다.',
          '네, 물을 사지 않습니다.',
          '아니요, 한국 사람입니다.'
        ],
        correctAnswer: 0,
        explanation: 'Câu hỏi nghi vấn "물을 마집합니까?" (Có uống nước không?) cần câu trả lời đồng ý "네, 물을 마십니다" (Vâng, tôi uống nước).',
        vocabulary: [
          { kr: '물', vi: 'Nước' },
          { kr: '마시다', vi: 'Uống' }
        ]
      },
      {
        id: 2,
        type: 'listening',
        section: 'Nghe & Chọn địa điểm diễn ra hội thoại',
        passage: '가: 이 사과 얼마예요? / 나: 한 개에 천 원입니다.',
        questionText: '두 사람은 어디에 있습니까? (Hai người đang ở đâu?)',
        options: ['시장 (Chợ / Siêu thị)', '병인 (Bệnh viện)', '은행 (Ngân hàng)', '우체국 (Bưu điện)'],
        correctAnswer: 0,
        explanation: 'Hội thoại hỏi giá táo ("이 사과 얼마예요?") diễn ra ở 시장 (Chợ / Cửa hàng trái cây).',
        vocabulary: [
          { kr: '사과', vi: 'Quả táo' },
          { kr: '얼마예요', vi: 'Bao nhiêu tiền' },
          { kr: '시장', vi: 'Chợ' }
        ]
      },
      {
        id: 3,
        type: 'listening',
        section: 'Nghe bức tranh & Chọn hành động tương ứng',
        questionText: '여자는 지금 무엇을 하고 있습니까? (Người phụ nữ đang làm gì?)',
        options: [
          '전화를 하고 있습니다. (Đang nghe điện thoại)',
          '밥을 먹고 있습니다. (Đang ăn cơm)',
          '청소를 하고 있습니다. (Đang dọn dẹp)',
          '노래를 부르고 있습니다. (Đang hát)'
        ],
        correctAnswer: 0,
        explanation: 'Mô tả hình ảnh điện thoại gọi thoại: Đáp án 1 전화를 하고 있습니다 (Đang nói chuyện điện thoại).',
        vocabulary: [
          { kr: '전화하다', vi: 'Gọi điện thoại' },
          { kr: '청소하다', vi: 'Dọn dẹp' }
        ]
      },
      {
        id: 4,
        type: 'listening',
        section: 'Nghe hội thoại dài & Trả lời câu hỏi trọng tâm',
        passage: '남: 주말에 뭐 했어요? / 여: 친구와 같이 영화를 봤어요. 영화가 아주 재미있었어요. 남씨는요? / 남: 저는 집에서 쉬었어요.',
        questionText: '여자는 주말에 무엇을 했습니까? (Người phụ nữ đã làm gì vào cuối tuần?)',
        options: [
          '영화를 봤습니다.',
          '집에서 쉬었습니다.',
          '한국어를 공부했습니다.',
          '친구를 기다렸습니다.'
        ],
        correctAnswer: 0,
        explanation: 'Người phụ nữ nói: "친구와 같이 영화를 봤어요" (Tôi đã xem phim cùng bạn). Do đó chọn đáp án 1.',
        vocabulary: [
          { kr: '주말', vi: 'Cuối tuần' },
          { kr: '재미있다', vi: 'Thú vị / Hay' }
        ]
      }
    ]
  },
  {
    id: 'topik2-reading-01',
    title: 'Đề Thi Luyện TOPIK II - Trung & Cao Cấp (Level 3-6)',
    level: 'TOPIK II (Cấp 3-6)',
    type: 'Đọc',
    durationMinutes: 70,
    totalQuestions: 3,
    difficulty: 'Thách thức',
    description: 'Chuyên đề bài thi Đọc TOPIK II gồm báo chí, khoa học xã hội và ngữ pháp trung cấp.',
    questions: [
      {
        id: 1,
        type: 'reading',
        section: 'Ngữ pháp trung cấp (Cấu trúc tương đương)',
        questionText: '지속적인 연습을 (      ) 실력이 향상될 수 없다.',
        options: ['하지 않고서는', '할 뿐만 아니라', '하더라도', '하자마자'],
        correctAnswer: 0,
        explanation: 'Cấu trúc "-지 않고서는 ... -ㄹ 수 없다" mang nghĩa "Nếu không làm X thì không thể Y". Đáp án 0 là chính xác.',
        vocabulary: [
          { kr: '지속적', vi: 'Mang tính liên tục' },
          { kr: '향상되다', vi: 'Được nâng cao / Tiến bộ' }
        ]
      },
      {
        id: 2,
        type: 'reading',
        section: 'Đọc hiểu báo chí & Tin tức xã hội',
        passage: '최근 인공지능(AI) 기술의 발달로 인해 làm việc automation gia tăng. 이에 따라 미래 직업 시장의 변화에 대비한 교육 rèn luyện là rất cần thiết.',
        questionText: '이 글의 중심 생각으로 가장 적절한 것을 고르십시오.',
        options: [
          'AI 발달에 맞춘 미래 직업 교육이 필요하다.',
          '인공지능 기술 개발을 중단해야 한다.',
          '기존의 직업은 모두 사라질 것이다.',
          'AI 기술은 Education 분야에 ảnh hưởng không đáng kể.'
        ],
        correctAnswer: 0,
        explanation: 'Bài viết nhấn mạnh việc công nghệ AI phát triển dẫn tới thay đổi thị trường việc làm, do đó cần giáo dục chuẩn bị cho tương lai. Đáp án 1 nêu đúng suy nghĩ trọng tâm.',
        vocabulary: [
          { kr: '인공지능', vi: 'Trí tuệ nhân tạo (AI)' },
          { kr: '대비하다', vi: 'Chuẩn bị / Đối phó' },
          { kr: '적절하다', vi: 'Thích hợp / Phù hợp' }
        ]
      },
      {
        id: 3,
        type: 'writing',
        section: 'TOPIK II Câu 51 - Điền câu vào đoạn văn ngắn (쓰기)',
        passage: '선생님, 안녕하십니까? 저는 지난주에 졸업한 김민수입니다. 이번에 원하는 회사에 취직하게 되었습니다. 모두 선생님께서 잘 가르쳐 (      ) 덕분입니다.',
        questionText: '빈칸 (      )에 들어갈 적절한 표현을 쓰십시오.',
        options: [
          '주신',
          '주셨기',
          '주셨지만',
          '주셔서'
        ],
        correctAnswer: 0,
        explanation: 'Điền vế định ngữ quá khứ kính ngữ: "선생님께서 잘 가르쳐 (주신) 덕분입니다" (Nhờ có sự dạy dỗ chỉ bảo của thầy/cô).',
        vocabulary: [
          { kr: '취직하다', vi: 'Xin được việc làm' },
          { kr: '덕분에', vi: 'Nhờ có' }
        ]
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
