export interface SubtitleSegment {
  id: number;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  korean: string;
  romaja: string;
  vietnamese: string;
  speaker?: string;
}

export interface ShadowingVideoItem {
  id: string;
  title: string;
  youtubeId: string;
  category: 'k-drama' | 'vlog' | 'kpop' | 'daily';
  categoryLabel: string;
  difficulty: 'Sơ cấp' | 'Trung cấp' | 'Nâng cao';
  duration: string;
  description: string;
  subtitles: SubtitleSegment[];
}

export interface SoundItem {
  character: string;
  type: 'plain' | 'aspirated' | 'tense';
  typeName: string;
  romaja: string;
  mouthTip: string;
  exampleWord: string;
  exampleMeaning: string;
}

export interface PronunciationGroup {
  id: string;
  title: string;
  description: string;
  sounds: SoundItem[];
}

export interface DialogueLine {
  id: number;
  speaker: 'system' | 'user';
  speakerName: string;
  korean: string;
  vietnamese: string;
  suggestedResponse?: string;
  hints?: string[];
}

export interface RoleplayScenario {
  id: string;
  title: string;
  location: string;
  category: string;
  description: string;
  avatar: string;
  dialogue: DialogueLine[];
}

export const SHADOWING_VIDEOS: ShadowingVideoItem[] = [
  {
    id: 'vid-kdrama-1',
    title: '🎬 Queen of Tears - Lời Tỏ Tình Ngọt Ngào',
    youtubeId: 'P_S94Hh6m5Q',
    category: 'k-drama',
    categoryLabel: 'Phim K-Drama',
    difficulty: 'Sơ cấp',
    duration: '0:45',
    description: 'Trích đoạn thoại tình cảm lãng mạn được yêu thích nhất trong phim Nước Mắt Hoàng Hậu.',
    subtitles: [
      {
        id: 1,
        startTime: 0,
        endTime: 6,
        korean: '내가 당신을 얼마나 좋아하는지 모르죠?',
        romaja: 'Nae-ga dang-sin-eul ol-ma-na jo-a-ha-neun-ji mo-reu-jyo?',
        vietnamese: 'Anh có biết em thích anh đến mức nào không?',
        speaker: 'Hải In (Nữ chính)'
      },
      {
        id: 2,
        startTime: 6,
        endTime: 12,
        korean: '매일매일 생각나고, 보고 싶었어요.',
        romaja: 'Mae-il-mae-il saeng-gak-na-go, bo-go sip-eoss-eo-yo.',
        vietnamese: 'Ngày nào em cũng nhớ và muốn gặp anh.',
        speaker: 'Hải In (Nữ chính)'
      },
      {
        id: 3,
        startTime: 12,
        endTime: 18,
        korean: '앞으로도 내 옆에 계속 있어 줄래요?',
        romaja: 'Ap-eu-ro-do nae yeop-e gye-sok iss-eo jul-rae-yo?',
        vietnamese: 'Từ nay về sau anh vẫn sẽ luôn ở bên em chứ?',
        speaker: 'Hải In (Nữ chính)'
      },
      {
        id: 4,
        startTime: 18,
        endTime: 25,
        korean: '당연하죠. 언제나 당신 곁에 있을게요.',
        romaja: 'Dang-yeon-ha-jyo. Eon-je-na dang-sin gyeot-e iss-eul-ge-yo.',
        vietnamese: 'Tất nhiên rồi. Anh sẽ luôn luôn ở bên cạnh em.',
        speaker: 'Hiện Thụ (Nam chính)'
      }
    ]
  },
  {
    id: 'vid-vlog-1',
    title: '☕ Vlog Đi Gọi Cà Phê & Bánh Ngọt Tại Hongdae',
    youtubeId: 'k2N2Y5H6X4w',
    category: 'vlog',
    categoryLabel: 'Vlog Đời Sống',
    difficulty: 'Sơ cấp',
    duration: '0:50',
    description: 'Học hội thoại giao tiếp thực tế khi đi uống cà phê với bạn bè tại quán Cafe Seoul.',
    subtitles: [
      {
        id: 1,
        startTime: 0,
        endTime: 5,
        korean: '안녕하세요! 아이스 아메리카노 두 잔 부탁드려요.',
        romaja: 'An-nyeong-ha-se-yo! A-i-seu a-me-ri-ka-no du jan bu-tak-deu-ryeo-yo.',
        vietnamese: 'Xin chào! Vui lòng cho tôi 2 ly Iced Americano ạ.',
        speaker: 'Vlogger'
      },
      {
        id: 2,
        startTime: 5,
        endTime: 11,
        korean: '디저트로는 딸기 생크림 케이크 하나 주세요.',
        romaja: 'Di-jeo-teu-ro-neun ttal-gi saeng-keu-rim ke-i-keu ha-na ju-se-yo.',
        vietnamese: 'Tráng miệng cho tôi một chiếc bánh kem dâu tươi nhé.',
        speaker: 'Vlogger'
      },
      {
        id: 3,
        startTime: 11,
        endTime: 18,
        korean: '여기 창가 자리가 정말 예쁜 것 같아요!',
        romaja: 'Yeo-gi chang-ga ja-ri-ga jeong-mal ye-ppeun geot gat-a-yo!',
        vietnamese: 'Ghế ngồi cạnh cửa sổ ở đây trông đẹp tuyệt vời!',
        speaker: 'Bạn đi cùng'
      },
      {
        id: 4,
        startTime: 18,
        endTime: 24,
        korean: '맞아, 사진도 잘 나오고 분위기도 좋다.',
        romaja: 'Maj-a, sa-jin-do jal na-o-go bun-wi-gi-do jot-da.',
        vietnamese: 'Đúng vậy, chụp ảnh lên đẹp mà không khí cũng thích nữa.',
        speaker: 'Vlogger'
      }
    ]
  },
  {
    id: 'vid-kpop-1',
    title: '🌟 Idol K-Pop Phát Biểu Cảm Ơn Fan Đêm Concert',
    youtubeId: '07d2dXHYb94',
    category: 'kpop',
    categoryLabel: 'K-Pop Idol',
    difficulty: 'Trung cấp',
    duration: '0:55',
    description: 'Luyện nói nhại phát biểu truyền cảm hứng ngọt ngào của idol K-Pop dành tặng người hâm mộ.',
    subtitles: [
      {
        id: 1,
        startTime: 0,
        endTime: 7,
        korean: '오늘 이 자리를 빛내주신 팬 여러분, 진심으로 감사드립니다!',
        romaja: 'O-neul i ja-ri-reul bit-nae-ju-sin paen yeo-reo-bun, jin-sim-eu-ro gam-sa-deu-rim-ni-da!',
        vietnamese: 'Các bạn fan đã đến làm sáng bừng đêm nay, mình xin chân thành cảm ơn mọi người!',
        speaker: 'Idol K-Pop'
      },
      {
        id: 2,
        startTime: 7,
        endTime: 14,
        korean: '여러분 덕분에 저희가 꿈을 이루고 무대에 설 수 있었어요.',
        romaja: 'Yeo-reo-bun deok-bu-ne jeo-hui-ga kkum-eul i-ru-go mu-dae-e seol su iss-eoss-eo-yo.',
        vietnamese: 'Nhờ có các bạn mà chúng mình mới thực hiện được ước mơ và đứng trên sân khấu này.',
        speaker: 'Idol K-Pop'
      },
      {
        id: 3,
        startTime: 14,
        endTime: 22,
        korean: '앞으로도 더 멋진 음악으로 보답하겠습니다. 영원히 사랑해요!',
        romaja: 'Ap-eu-ro-do deo meos-jin eum-ak-eu-ro bo-dap-ha-gess-seum-ni-da. Yeong-won-hi sa-rang-hae-yo!',
        vietnamese: 'Từ nay về sau chúng mình sẽ đáp lại bằng những bản nhạc tuyệt vời hơn nữa. Yêu các bạn mãi mãi!',
        speaker: 'Idol K-Pop'
      }
    ]
  }
];

export const PRONUNCIATION_GROUPS: PronunciationGroup[] = [
  {
    id: 'group-k',
    title: 'Bộ âm G / K (ㄱ - ㅋ - ㄲ)',
    description: 'Phân biệt giữa Âm nhẹ thường (ㄱ), Âm bật hơi mạnh (ㅋ) và Âm căng cứng lưỡi (ㄲ)',
    sounds: [
      {
        character: 'ㄱ',
        type: 'plain',
        typeName: 'Âm thường (Plain)',
        romaja: 'g / k',
        mouthTip: 'Môi mở tự nhiên, phát âm nhẹ nhàng, không bật hơi mạnh.',
        exampleWord: '가구',
        exampleMeaning: 'Đồ nội thất (Ga-gu)'
      },
      {
        character: 'ㅋ',
        type: 'aspirated',
        typeName: 'Âm bật hơi (Aspirated)',
        romaja: 'kh',
        mouthTip: 'Đặt một tờ giấy trước miệng, phát âm bật luồng hơi mạnh làm tờ giấy bay.',
        exampleWord: '카메라',
        exampleMeaning: 'Máy ảnh (Kha-me-ra)'
      },
      {
        character: 'ㄲ',
        type: 'tense',
        typeName: 'Âm căng (Tense)',
        romaja: 'kk',
        mouthTip: 'Gồng nhẹ cơ cổ họng, nén hơi lại và bật âm gãy gọn, không ra hơi.',
        exampleWord: '까치',
        exampleMeaning: 'Chim chim chóc / Chim khách (Kka-chi)'
      }
    ]
  },
  {
    id: 'group-t',
    title: 'Bộ âm D / T (ㄷ - ㅌ - ㄸ)',
    description: 'Phân biệt đầu lưỡi chạm nướu răng trên: ㄷ (nhẹ), ㅌ (bật hơi), ㄸ (gồng căng)',
    sounds: [
      {
        character: 'ㄷ',
        type: 'plain',
        typeName: 'Âm thường (Plain)',
        romaja: 'd / t',
        mouthTip: 'Đầu lưỡi chạm nhẹ nướu răng trên, phát âm d/t nhẹ nhàng.',
        exampleWord: '다리',
        exampleMeaning: 'Đôi chân / Cây cầu (Da-ri)'
      },
      {
        character: 'ㅌ',
        type: 'aspirated',
        typeName: 'Âm bật hơi (Aspirated)',
        romaja: 'th',
        mouthTip: 'Đầu lưỡi đè nướu rồi bật mạnh ra luồng gió rõ rệt.',
        exampleWord: '타조',
        exampleMeaning: 'Đà điểu (Tha-jo)'
      },
      {
        character: 'ㄸ',
        type: 'tense',
        typeName: 'Âm căng (Tense)',
        romaja: 'tt',
        mouthTip: 'Nén khí ở cổ họng, lưỡi siết chặt nướu rồi nhả âm dứt khoát.',
        exampleWord: '딸기',
        exampleMeaning: 'Quả dâu tây (Ttal-gi)'
      }
    ]
  },
  {
    id: 'group-p',
    title: 'Bộ âm B / P (ㅂ - ㅍ - ㅃ)',
    description: 'Phân biệt khép 2 môi: ㅂ (khép nhẹ), ㅍ (bật hơi nổ môi), ㅃ (ép chặt 2 môi)',
    sounds: [
      {
        character: 'ㅂ',
        type: 'plain',
        typeName: 'Âm thường (Plain)',
        romaja: 'b / p',
        mouthTip: 'Hai môi khép nhẹ, mở ra phát âm b/p tự nhiên.',
        exampleWord: '바다',
        exampleMeaning: 'Biển (Ba-da)'
      },
      {
        character: 'ㅍ',
        type: 'aspirated',
        typeName: 'Âm bật hơi (Aspirated)',
        romaja: 'ph',
        mouthTip: 'Hai môi mím lại rồi bật gió nổ ra luồng khí mạnh.',
        exampleWord: '파도',
        exampleMeaning: 'Sóng biển (Pha-do)'
      },
      {
        character: 'ㅃ',
        type: 'tense',
        typeName: 'Âm căng (Tense)',
        romaja: 'pp',
        mouthTip: 'Hai môi ép chặt nén lực, bật âm vang không ra gió.',
        exampleWord: '빵',
        exampleMeaning: 'Bánh mì (Ppang)'
      }
    ]
  },
  {
    id: 'group-s',
    title: 'Bộ âm S (ㅅ - ㅆ)',
    description: 'Phân biệt âm S thường (ㅅ) nhẹ nhàng và âm S căng (ㅆ) sắc bén',
    sounds: [
      {
        character: 'ㅅ',
        type: 'plain',
        typeName: 'Âm thường (Plain)',
        romaja: 's',
        mouthTip: 'Đầu lưỡi gần răng trên, xì hơi nhẹ nhàng qua kẽ răng.',
        exampleWord: '사과',
        exampleMeaning: 'Quả táo / Lời xin lỗi (Sa-gwa)'
      },
      {
        character: 'ㅆ',
        type: 'tense',
        typeName: 'Âm căng (Tense)',
        romaja: 'ss',
        mouthTip: 'Răng khép sát, đẩy luồng khí qua kẽ răng cao độ và đanh sắc.',
        exampleWord: '싸움',
        exampleMeaning: 'Cuộc cãi nhau (Ssa-um)'
      }
    ]
  },
  {
    id: 'group-ch',
    title: 'Bộ âm J / CH (ㅈ - ㅊ - ㅉ)',
    description: 'Phân biệt mặt lưỡi áp vòm họng: ㅈ (nhẹ), ㅊ (bật gió mạnh), ㅉ (căng gãy gọn)',
    sounds: [
      {
        character: 'ㅈ',
        type: 'plain',
        typeName: 'Âm thường (Plain)',
        romaja: 'j / ch',
        mouthTip: 'Mặt lưỡi chạm vòm miệng cứng, nhả hơi phát âm j/ch nhẹ.',
        exampleWord: '지도',
        exampleMeaning: 'Bản đồ (Ji-do)'
      },
      {
        character: 'ㅊ',
        type: 'aspirated',
        typeName: 'Âm bật hơi (Aspirated)',
        romaja: 'ch',
        mouthTip: 'Bật luồng khí mạnh rào rạt từ vòm họng ra.',
        exampleWord: '치마',
        exampleMeaning: 'Váy (Chi-ma)'
      },
      {
        character: 'ㅉ',
        type: 'tense',
        typeName: 'Âm căng (Tense)',
        romaja: 'jj',
        mouthTip: 'Siết mặt lưỡi vào vòm họng, nhả âm đanh gọn.',
        exampleWord: '짜장면',
        exampleMeaning: 'Mì tương đen (Jja-jang-myeon)'
      }
    ]
  }
];

export const ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  {
    id: 'rp-cafe',
    title: '☕ Đặt nước tại Cafe Hongdae',
    location: 'Quán Cafe Hongdae, Seoul',
    category: 'Giao tiếp hàng ngày',
    description: 'Thực hành gọi đồ uống, chọn size và yêu cầu mang đi tại quán cà phê phong cách Hàn Quốc.',
    avatar: '👩‍🍳 Nhân viên Barista',
    dialogue: [
      {
        id: 1,
        speaker: 'system',
        speakerName: 'Barista Cafe',
        korean: '안녕하세요! 주문 도와드릴까요?',
        vietnamese: 'Xin chào quý khách! Tôi có thể giúp gì cho quý khách ạ?',
      },
      {
        id: 2,
        speaker: 'user',
        speakerName: 'Bạn (Khách hàng)',
        korean: '네, 아이스 아메리카노 한 잔 주세요.',
        vietnamese: 'Vâng, cho tôi một ly Iced Americano ạ.',
        suggestedResponse: '네, 아이스 아메리카노 한 잔 주세요.',
        hints: ['아이스 아메리카노 (Iced Americano)', '한 잔 주세요 (Cho tôi 1 ly)']
      },
      {
        id: 3,
        speaker: 'system',
        speakerName: 'Barista Cafe',
        korean: '사이즈는 뭘로 하시겠어요? 레귤러랑 라지가 있습니다.',
        vietnamese: 'Quý khách muốn chọn size nào ạ? Chúng tôi có size Regular và Large.',
      },
      {
        id: 4,
        speaker: 'user',
        speakerName: 'Bạn (Khách hàng)',
        korean: '레귤러 사이즈로 주세요. 드시고 가시나요, 포장이신가요?',
        vietnamese: 'Cho tôi size Regular ạ. Cho tôi mang đi nhé.',
        suggestedResponse: '레귤러 사이즈로 포장해 주세요.',
        hints: ['레귤러 (Regular)', '포장해 주세요 (Cho tôi mang đi)']
      },
      {
        id: 5,
        speaker: 'system',
        speakerName: 'Barista Cafe',
        korean: '네, 총 4,500원입니다. 카드 결제 도와드릴게요!',
        vietnamese: 'Vâng, tổng cộng là 4,500 won ạ. Tôi sẽ thanh toán bằng thẻ cho quý khách nhé!',
      }
    ]
  },
  {
    id: 'rp-bbq',
    title: '🥩 Ăn quán nướng Samgyeopsal',
    location: 'Nhà hàng BBQ Myeongdong',
    category: 'Ăn uống & Nhà hàng',
    description: 'Thực hành gọi thịt nướng, xin thêm kim chi và đồ nhắm tại quán BBQ.',
    avatar: '👨‍🍳 Chủ quán BBQ',
    dialogue: [
      {
        id: 1,
        speaker: 'system',
        speakerName: 'Chủ quán BBQ',
        korean: '어서오세요! 몇 분이세요?',
        vietnamese: 'Xin chào mừng quý khách! Quý khách đi mấy người ạ?',
      },
      {
        id: 2,
        speaker: 'user',
        speakerName: 'Bạn (Khách hàng)',
        korean: '두 명이에요. 창가 자리에 앉아도 될까요?',
        vietnamese: 'Chúng tôi đi 2 người. Chúng tôi ngồi ghế cạnh cửa sổ được không ạ?',
        suggestedResponse: '두 명이에요. 창가 자리에 앉을게요.',
        hints: ['두 명이에요 (2 người ạ)', '창가 자리 (Ghế cạnh cửa sổ)']
      },
      {
        id: 3,
        speaker: 'system',
        speakerName: 'Chủ quán BBQ',
        korean: '네, 이쪽으로 앉으세요. 메뉴판 드릴게요. 뭐 주문하시겠어요?',
        vietnamese: 'Vâng, mời quý khách ngồi bên này. Tôi gửi thực đơn. Quý khách dùng gì ạ?',
      },
      {
        id: 4,
        speaker: 'user',
        speakerName: 'Bạn (Khách hàng)',
        korean: '삼겹살 2인분이랑 소주 한 병 주세요.',
        vietnamese: 'Cho chúng tôi 2 phần thịt ba chỉ và 1 chai Soju ạ.',
        suggestedResponse: '삼겹살 2인분이랑 소주 한 병 주세요.',
        hints: ['삼겹살 2인분 (2 phần thịt ba chỉ)', '소주 한 병 (1 chai Soju)']
      },
      {
        id: 5,
        speaker: 'system',
        speakerName: 'Chủ quán BBQ',
        korean: '네! 금방 준비해 드리겠습니다. 맛있게 드세요!',
        vietnamese: 'Vâng ạ! Tôi sẽ chuẩn bị ngay. Chúc quý khách ngon miệng!',
      }
    ]
  },
  {
    id: 'rp-taxi',
    title: '🚕 Đi Taxi ở Seoul',
    location: 'Đường phố Seoul',
    category: 'Di chuyển & Du lịch',
    description: 'Thực hành nói điểm đến với tài xế taxi và yêu cầu bật đồng hồ tính tiền.',
    avatar: '👨‍✈️ Tài xế Taxi',
    dialogue: [
      {
        id: 1,
        speaker: 'system',
        speakerName: 'Tài xế Taxi',
        korean: '어디로 모실까요?',
        vietnamese: 'Tôi chở quý khách đi đâu ạ?',
      },
      {
        id: 2,
        speaker: 'user',
        speakerName: 'Bạn (Hành khách)',
        korean: '홍대입구역 9번 출구로 가주세요.',
        vietnamese: 'Cho tôi đến cửa số 9 ga Hongdae ạ.',
        suggestedResponse: '홍대입구역 9번 출구로 가주세요.',
        hints: ['홍대입구역 (Ga Hongdae)', '가주세요 (Hãy đưa tôi đến)']
      },
      {
        id: 3,
        speaker: 'system',
        speakerName: 'Tài xế Taxi',
        korean: '네, 알겠습니다. 터널 지나서 빠른 길로 갈까요?',
        vietnamese: 'Vâng, tôi hiểu rồi. Tôi đi đường nhanh qua hầm nhé?',
      },
      {
        id: 4,
        speaker: 'user',
        speakerName: 'Bạn (Hành khách)',
        korean: '네, 빠른 길로 가주세요. 얼마나 걸려요?',
        vietnamese: 'Vâng, hãy đi đường nhanh giúp tôi. Mất khoảng bao lâu ạ?',
        suggestedResponse: '빠른 길로 가주세요. 얼마나 걸려요?',
        hints: ['빠른 길 (Đường nhanh)', '얼마나 걸려요 (Mất bao lâu)']
      },
      {
        id: 5,
        speaker: 'system',
        speakerName: 'Tài xế Taxi',
        korean: '한 15분 정도 걸립니다. 도착했습니다! 12,000원입니다.',
        vietnamese: 'Khoảng 15 phút ạ. Đã đến nơi rồi! Của quý khách là 12,000 won.',
      }
    ]
  }
];
