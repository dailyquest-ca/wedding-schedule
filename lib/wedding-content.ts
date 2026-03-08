export type Locale = "en" | "ja";

export type SlotCategory =
  | "excursion"
  | "dinner"
  | "busy"
  | "wedding"
  | "free"
  | "travel";

export interface TimeSlot {
  time: string;
  label: string;
  description?: string;
  category: SlotCategory;
}

export interface ScheduleDay {
  dateLabel: string;
  dayLabel: string;
  slots: TimeSlot[];
}

export interface CostItem {
  label: string;
  amount: string;
}

export interface WeddingContent {
  title: string;
  subtitle: string;
  schedule: ScheduleDay[];
  notes: string[];
  costs: CostItem[];
  whatsapp: {
    url: string;
    label: string;
  };
  toggleLabel: string;
}

const EN: WeddingContent = {
  title: "A & Z Wedding",
  subtitle: "One week of love, food & adventure",
  toggleLabel: "日本語",
  schedule: [
    {
      dateLabel: "Mon, Sep 14",
      dayLabel: "Monday",
      slots: [
        {
          time: "All day",
          label: "Arrival day",
          description: "Settle in and rest up!",
          category: "travel",
        },
        {
          time: "7:00 PM",
          label: "Welcome dinner",
          description: "Casual get-together",
          category: "dinner",
        },
      ],
    },
    {
      dateLabel: "Tue, Sep 15",
      dayLabel: "Tuesday",
      slots: [
        {
          time: "9:00 AM",
          label: "Temple tour",
          description: "Guided morning walk",
          category: "excursion",
        },
        {
          time: "12:30 PM",
          label: "Lunch — free time",
          category: "free",
        },
        {
          time: "6:30 PM",
          label: "Group dinner",
          description: "Local izakaya",
          category: "dinner",
        },
      ],
    },
    {
      dateLabel: "Wed, Sep 16",
      dayLabel: "Wednesday",
      slots: [
        {
          time: "10:00 AM",
          label: "Beach excursion",
          description: "Snorkelling & swimming",
          category: "excursion",
        },
        {
          time: "2:00 PM",
          label: "Anna & Zach — rehearsal prep",
          category: "busy",
        },
        {
          time: "7:00 PM",
          label: "Dinner on the terrace",
          category: "dinner",
        },
      ],
    },
    {
      dateLabel: "Thu, Sep 17",
      dayLabel: "Thursday",
      slots: [
        {
          time: "9:00 AM",
          label: "Market & cooking class",
          description: "Learn to make local favourites",
          category: "excursion",
        },
        {
          time: "3:00 PM",
          label: "Anna & Zach — final fittings",
          category: "busy",
        },
        {
          time: "7:30 PM",
          label: "Rehearsal dinner",
          description: "Smart casual",
          category: "dinner",
        },
      ],
    },
    {
      dateLabel: "Fri, Sep 18",
      dayLabel: "Friday — The Big Day",
      slots: [
        {
          time: "10:00 AM",
          label: "Morning at leisure",
          category: "free",
        },
        {
          time: "2:00 PM",
          label: "Wedding ceremony",
          description: "Please arrive by 1:45 PM",
          category: "wedding",
        },
        {
          time: "4:00 PM",
          label: "Cocktail hour",
          category: "wedding",
        },
        {
          time: "6:00 PM",
          label: "Reception & dinner",
          description: "Dancing to follow!",
          category: "wedding",
        },
      ],
    },
    {
      dateLabel: "Sat, Sep 19",
      dayLabel: "Saturday",
      slots: [
        {
          time: "11:00 AM",
          label: "Recovery brunch",
          description: "Slow start encouraged",
          category: "free",
        },
        {
          time: "2:00 PM",
          label: "Waterfall hike",
          description: "Optional afternoon adventure",
          category: "excursion",
        },
        {
          time: "7:00 PM",
          label: "Farewell dinner",
          category: "dinner",
        },
      ],
    },
    {
      dateLabel: "Sun, Sep 20",
      dayLabel: "Sunday",
      slots: [
        {
          time: "All day",
          label: "Departure day",
          description: "Safe travels home!",
          category: "travel",
        },
      ],
    },
  ],
  notes: [
    "Dress code for the wedding: semi-formal / smart casual.",
    "Sunscreen and insect repellent are a must for excursions.",
    "Shuttle service runs between the hotel and all venues.",
    "Dietary needs? Let us know via WhatsApp so we can plan ahead.",
  ],
  costs: [
    { label: "Excursions", amount: "Included" },
    { label: "Group dinners", amount: "Included" },
    { label: "Personal bar tabs", amount: "On your own" },
  ],
  whatsapp: {
    url: "https://chat.whatsapp.com/example-group-link",
    label: "Join our WhatsApp group",
  },
};

const JA: WeddingContent = {
  title: "A & Z ウェディング",
  subtitle: "愛と食と冒険の一週間",
  toggleLabel: "English",
  schedule: [
    {
      dateLabel: "9月14日（月）",
      dayLabel: "月曜日",
      slots: [
        {
          time: "終日",
          label: "到着日",
          description: "ゆっくり休んでください！",
          category: "travel",
        },
        {
          time: "19:00",
          label: "ウェルカムディナー",
          description: "カジュアルな集まり",
          category: "dinner",
        },
      ],
    },
    {
      dateLabel: "9月15日（火）",
      dayLabel: "火曜日",
      slots: [
        {
          time: "9:00",
          label: "お寺ツアー",
          description: "ガイド付き朝の散歩",
          category: "excursion",
        },
        {
          time: "12:30",
          label: "ランチ — 自由時間",
          category: "free",
        },
        {
          time: "18:30",
          label: "グループディナー",
          description: "地元の居酒屋",
          category: "dinner",
        },
      ],
    },
    {
      dateLabel: "9月16日（水）",
      dayLabel: "水曜日",
      slots: [
        {
          time: "10:00",
          label: "ビーチエクスカーション",
          description: "シュノーケリング＆水泳",
          category: "excursion",
        },
        {
          time: "14:00",
          label: "Anna & Zach — リハーサル準備",
          category: "busy",
        },
        {
          time: "19:00",
          label: "テラスディナー",
          category: "dinner",
        },
      ],
    },
    {
      dateLabel: "9月17日（木）",
      dayLabel: "木曜日",
      slots: [
        {
          time: "9:00",
          label: "市場＆料理教室",
          description: "地元の料理を学ぶ",
          category: "excursion",
        },
        {
          time: "15:00",
          label: "Anna & Zach — 最終フィッティング",
          category: "busy",
        },
        {
          time: "19:30",
          label: "リハーサルディナー",
          description: "スマートカジュアル",
          category: "dinner",
        },
      ],
    },
    {
      dateLabel: "9月18日（金）",
      dayLabel: "金曜日 — 当日",
      slots: [
        {
          time: "10:00",
          label: "自由な朝",
          category: "free",
        },
        {
          time: "14:00",
          label: "結婚式",
          description: "13:45までにお越しください",
          category: "wedding",
        },
        {
          time: "16:00",
          label: "カクテルアワー",
          category: "wedding",
        },
        {
          time: "18:00",
          label: "披露宴＆ディナー",
          description: "ダンスもあります！",
          category: "wedding",
        },
      ],
    },
    {
      dateLabel: "9月19日（土）",
      dayLabel: "土曜日",
      slots: [
        {
          time: "11:00",
          label: "リカバリーブランチ",
          description: "ゆっくりスタート推奨",
          category: "free",
        },
        {
          time: "14:00",
          label: "滝ハイキング",
          description: "午後のオプション冒険",
          category: "excursion",
        },
        {
          time: "19:00",
          label: "お別れディナー",
          category: "dinner",
        },
      ],
    },
    {
      dateLabel: "9月20日（日）",
      dayLabel: "日曜日",
      slots: [
        {
          time: "終日",
          label: "出発日",
          description: "お気をつけて！",
          category: "travel",
        },
      ],
    },
  ],
  notes: [
    "結婚式のドレスコード：セミフォーマル／スマートカジュアル。",
    "エクスカーションには日焼け止めと虫除けをお忘れなく。",
    "ホテルと各会場間のシャトルサービスあり。",
    "食事の制限がある方はWhatsAppでお知らせください。",
  ],
  costs: [
    { label: "エクスカーション", amount: "含まれています" },
    { label: "グループディナー", amount: "含まれています" },
    { label: "個人のバー代", amount: "各自負担" },
  ],
  whatsapp: {
    url: "https://chat.whatsapp.com/example-group-link",
    label: "WhatsAppグループに参加",
  },
};

const CONTENT: Record<Locale, WeddingContent> = { en: EN, ja: JA };

export function getContent(locale: Locale): WeddingContent {
  return CONTENT[locale];
}
