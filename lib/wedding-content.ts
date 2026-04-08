export type Locale = "en" | "ja";

export type SlotCategory =
  | "excursion"
  | "dinner"
  | "busy"
  | "wedding"
  | "free"
  | "travel";

export interface TimeSlot {
  id?: string;
  time: string;
  label: string;
  description?: string;
  category: SlotCategory;
  signupEnabled?: boolean;
}

export interface ScheduleDay {
  dateLabel: string;
  dayLabel: string;
  slots: TimeSlot[];
}

export interface WeddingContent {
  title: string;
  subtitle: string;
  schedule: ScheduleDay[];
  notes: string[];
  whatsapp: {
    url: string;
    label: string;
  };
  photos: {
    url: string;
    label: string;
  };
  toggleLabel: string;
}

const EN: WeddingContent = {
  title: "A & Z Wedding",
  subtitle: "Cancún, Mexico · April 5–13, 2026",
  toggleLabel: "日本語",
  schedule: [
    {
      dateLabel: "Sun, Apr 5",
      dayLabel: "Sunday",
      slots: [
        {
          time: "9:30 AM onward",
          label: "Early arrivals",
          description: "Ami, Nameet, Michelle, and Jeff arrive today.",
          category: "travel",
        },
      ],
    },
    {
      dateLabel: "Mon, Apr 6",
      dayLabel: "Monday — Arrivals & Welcome",
      slots: [
        {
          time: "2:53–4:04 PM",
          label: "Main arrival wave",
          description:
            "Anna, Zak, Ishan, Roxy, Romeo, Talia, Maki, Kazuki, Krystal, and Keith arrive. Settling in, exploring the resort, icebreakers and group hangout so no one feels like a stranger.",
          category: "travel",
        },
        {
          id: "apr6-dinner",
          time: "7:00 PM",
          label: "Dinner (venue TBD)",
          description: "Group dinner — location to be confirmed.",
          category: "dinner",
          signupEnabled: true,
        },
      ],
    },
    {
      dateLabel: "Tue, Apr 7",
      dayLabel: "Tuesday",
      slots: [
        {
          time: "12:50 PM onward",
          label: "More guests arrive",
          description:
            "Takaaki, Yoko, Kento, Haruna, Lance, Melody, and Victor arrive today.",
          category: "travel",
        },
        {
          id: "apr7-dinner",
          time: "6:30 PM",
          label: "Welcome Dinner at Main Buffet",
          description: "This might be moved or cancelled — we'll confirm soon.",
          category: "dinner",
          signupEnabled: true,
        },
      ],
    },
    {
      dateLabel: "Wed, Apr 8",
      dayLabel: "Wednesday — Chichen Itza Tour",
      slots: [
        {
          id: "apr8-chichen-itza",
          time: "6:00 AM – 6:00 PM",
          label: "Chichen Itza, Cenote & Valladolid tour",
          description: "All-day excursion to the ruins, cenote swim, and Valladolid.",
          category: "excursion",
          signupEnabled: true,
        },
        {
          id: "apr8-dinner",
          time: "8:00 PM",
          label: "Late dinner (venue TBD)",
          description: "Dinner after the tour — location to be confirmed.",
          category: "dinner",
          signupEnabled: true,
        },
      ],
    },
    {
      dateLabel: "Thu, Apr 9",
      dayLabel: "Thursday — Wedding Day",
      slots: [
        {
          time: "12:00–5:00 PM",
          label: "Wedding party prep (Bride/Groom/Wedding Party)",
          description:
            "Bride, Groom, and Wedding Party are getting ready and taking photos/videos. They will receive a separate detailed schedule.",
          category: "busy",
        },
        {
          time: "5:00–5:30 PM",
          label: "Ceremony @ Sky Venue",
          description: "Guests, please be seated by 4:45 PM.",
          category: "wedding",
        },
        {
          time: "5:30–7:00 PM",
          label: "Cocktail Hour @ Sky Venue",
          description:
            "Finger food and open bar. Please stay nearby since we may pull additional guests into photos from time to time.",
          category: "wedding",
        },
        {
          time: "7:00–8:00 PM",
          label: "Dinner",
          category: "wedding",
        },
        {
          time: "8:00–8:30 PM (ish)",
          label: "Video & Speeches",
          description:
            "Anyone who wants to congratulate us, share a funny story, or offer words of wisdom is welcome. It is a small, non-intimidating crew, so no need to be shy. :)",
          category: "wedding",
        },
        {
          time: "8:30–11:00 PM",
          label: "Dancing and merry-making",
          category: "wedding",
        },
      ],
    },
    {
      dateLabel: "Fri, Apr 10",
      dayLabel: "Friday — Rest day",
      slots: [
        {
          time: "All day",
          label: "Rest and relax",
          description: "Sleep in, pool, beach — a quiet day after the wedding.",
          category: "free",
        },
        {
          id: "apr10-catamaran",
          time: "11:00 AM–7:00 PM (ish)",
          label: "Catamaran to Isla Mujeres (snorkeling + island explore)",
          description:
            "Boat excursion (up to 30 people): catamaran, snorkeling, and time on Isla Mujeres. RSVP ASAP by around 4:00 PM. Cost: $145 USD per person.",
          category: "excursion",
          signupEnabled: true,
        },
        {
          time: "5:15 PM",
          label: "Victor departs",
          description: "Victor heads home today.",
          category: "travel",
        },
      ],
    },
    {
      dateLabel: "Sat, Apr 11",
      dayLabel: "Saturday — Cancun",
      slots: [
        {
          time: "2:58 PM onward",
          label: "Departures",
          description:
            "Takaaki, Yoko, Kento, Haruna, and Lance depart today.",
          category: "travel",
        },
        {
          time: "4:00 PM",
          label: "Departures",
          description: "Melody, Jeff, Michelle, Ami, and Nameet depart today.",
          category: "travel",
        },
        {
          id: "apr11-coco-bongo",
          time: "Evening",
          label: "Cancun & Coco Bongo",
          description: "Evening trip to Cancun for those still around.",
          category: "excursion",
          signupEnabled: true,
        },
      ],
    },
    {
      dateLabel: "Sun, Apr 12",
      dayLabel: "Sunday — Boat day & farewell",
      slots: [
        {
          id: "apr12-dinner",
          time: "Evening",
          label: "Final dinner at La Rinascita",
          description: "One last group dinner together.",
          category: "dinner",
          signupEnabled: true,
        },
      ],
    },
    {
      dateLabel: "Mon, Apr 13",
      dayLabel: "Monday — Goodbyes",
      slots: [
        {
          time: "Morning",
          label: "Final breakfasts and goodbyes",
          description: "Last chance to see everyone before heading home.",
          category: "free",
        },
        {
          time: "4:05–5:00 PM",
          label: "Final departures",
          description:
            "Anna, Zak, Ishan, Roxy, Romeo, Talia, Maki, Kazuki, Krystal, and Keith head home.",
          category: "travel",
        },
      ],
    },
  ],
  notes: [
    "Wedding day: Thursday, April 9, 2026.",
    "Arrival and departure times are approximate.",
    "Dress code: semi-formal / smart casual.",
    "Dietary needs? Let us know via WhatsApp.",
  ],
  whatsapp: {
    url: "https://chat.whatsapp.com/LLtkoDPyh0EHu7sbK2NxN8",
    label: "WhatsApp Group",
  },
  photos: {
    url: "https://photos.app.goo.gl/AnAaJKGTeqWx7jtY9",
    label: "Shared Photo Album",
  },
};

const JA: WeddingContent = {
  title: "A & Z ウェディング",
  subtitle: "カンクン、メキシコ · 2026年4月5日〜13日",
  toggleLabel: "English",
  schedule: [
    {
      dateLabel: "4月5日（日）",
      dayLabel: "日曜日",
      slots: [
        {
          time: "9:30以降",
          label: "先行到着",
          description:
            "Ami様、Nameet様、Michelle様、Jeff様 が本日到着します。",
          category: "travel",
        },
      ],
    },
    {
      dateLabel: "4月6日（月）",
      dayLabel: "月曜日 — 到着＆ウェルカム",
      slots: [
        {
          time: "14:53–16:04",
          label: "メインの到着",
          description:
            "Anna、Zak、Ishan様、Roxy様、Romeo様、Talia様、Maki様、Kazuki様、Krystal様、Keith様 が午後に到着。リゾートで落ち着いて、アイスブレイカーで打ち解けましょう。",
          category: "travel",
        },
        {
          id: "apr6-dinner",
          time: "19:00",
          label: "ディナー（会場未定）",
          description: "グループディナー — 場所は後日お知らせします。",
          category: "dinner",
          signupEnabled: true,
        },
      ],
    },
    {
      dateLabel: "4月7日（火）",
      dayLabel: "火曜日",
      slots: [
        {
          time: "12:50以降",
          label: "追加のゲスト到着",
          description:
            "Takaaki、Yoko、Kento様、Haruna様、Lance様、Melody様、Victor様 が本日到着します。",
          category: "travel",
        },
        {
          id: "apr7-dinner",
          time: "18:30",
          label: "ウェルカムディナー メインビュッフェ（仮）",
          description: "変更または中止になる可能性があります。決まり次第お知らせします。",
          category: "dinner",
          signupEnabled: true,
        },
      ],
    },
    {
      dateLabel: "4月8日（水）",
      dayLabel: "水曜日 — チチェン・イッツァツアー",
      slots: [
        {
          id: "apr8-chichen-itza",
          time: "6:00–18:00",
          label: "チチェン・イッツァ、セノーテ＆バジャドリド ツアー",
          description: "終日 — 遺跡、セノーテでの水泳、バジャドリド観光。",
          category: "excursion",
          signupEnabled: true,
        },
        {
          id: "apr8-dinner",
          time: "20:00",
          label: "遅めのディナー（会場未定）",
          description: "ツアー後のディナー — 場所は後日お知らせします。",
          category: "dinner",
          signupEnabled: true,
        },
      ],
    },
    {
      dateLabel: "4月9日（木）",
      dayLabel: "木曜日 — 結婚式当日",
      slots: [
        {
          time: "12:00〜17:00",
          label: "新郎新婦・ウェディングパーティー準備",
          description:
            "新郎新婦とウェディングパーティーは支度と写真・動画撮影で忙しい時間です。詳細スケジュールは別途共有します。",
          category: "busy",
        },
        {
          time: "17:00〜17:30",
          label: "挙式 @ Sky Venue",
          description: "ゲストの皆さまは16:45までにご着席ください。",
          category: "wedding",
        },
        {
          time: "17:30〜19:00",
          label: "カクテルアワー @ Sky Venue",
          description:
            "フィンガーフードとオープンバーがあります。途中で写真撮影にご協力いただくことがあるので、できるだけこのエリアでお過ごしください。",
          category: "wedding",
        },
        {
          time: "19:00〜20:00",
          label: "ディナー",
          category: "wedding",
        },
        {
          time: "20:00〜20:30頃",
          label: "ムービー＆スピーチ",
          description:
            "お祝いの言葉、面白いエピソード、アドバイスなど、話したい方はぜひどうぞ。少人数でアットホームな雰囲気なので気軽にご参加ください。 :)",
          category: "wedding",
        },
        {
          time: "20:30〜23:00",
          label: "ダンスタイム＆お祝い",
          category: "wedding",
        },
      ],
    },
    {
      dateLabel: "4月10日（金）",
      dayLabel: "金曜日 — 休息日",
      slots: [
        {
          time: "終日",
          label: "休息＆リラックス",
          description: "朝寝坊、プール、ビーチ — 結婚式のあとの静かな一日。",
          category: "free",
        },
        {
          id: "apr10-catamaran",
          time: "11:00〜19:00頃",
          label: "カタマランでイスラ・ムヘーレスへ（シュノーケリング＆島散策）",
          description:
            "最大30名のボートツアー。カタマラン、シュノーケリング、イスラ・ムヘーレス散策。参加可否はなるべく早く、目安16:00までにお知らせください。料金：1名あたり145米ドル。",
          category: "excursion",
          signupEnabled: true,
        },
        {
          time: "17:15",
          label: "Victor様 出発",
          description: "Victor様 は本日帰国します。",
          category: "travel",
        },
      ],
    },
    {
      dateLabel: "4月11日（土）",
      dayLabel: "土曜日 — カンクン",
      slots: [
        {
          time: "14:58以降",
          label: "出発",
          description:
            "Takaaki、Yoko、Kento様、Haruna様、Lance様 が本日出発します。",
          category: "travel",
        },
        {
          time: "16:00",
          label: "出発",
          description:
            "Melody様、Jeff様、Michelle様、Ami様、Nameet様 が本日出発します。",
          category: "travel",
        },
        {
          id: "apr11-coco-bongo",
          time: "夜",
          label: "カンクン＆Coco Bongo",
          description: "まだいるメンバーでカンクンへ。",
          category: "excursion",
          signupEnabled: true,
        },
      ],
    },
    {
      dateLabel: "4月12日（日）",
      dayLabel: "日曜日 — ボートデー＆お別れ",
      slots: [
        {
          id: "apr12-dinner",
          time: "夜",
          label: "La Rinascitaで最後のディナー",
          description: "みんなで最後のグループディナー。",
          category: "dinner",
          signupEnabled: true,
        },
      ],
    },
    {
      dateLabel: "4月13日（月）",
      dayLabel: "月曜日 — お別れ",
      slots: [
        {
          time: "朝",
          label: "最後の朝食とお別れ",
          description: "帰国前、みんなに会える最後の機会。",
          category: "free",
        },
        {
          time: "16:05–17:00",
          label: "最終出発",
          description:
            "Anna、Zak、Ishan様、Roxy様、Romeo様、Talia様、Maki様、Kazuki様、Krystal様、Keith様 が帰国します。",
          category: "travel",
        },
      ],
    },
  ],
  notes: [
    "結婚式は2026年4月9日（木）です。",
    "到着・出発時刻は目安です。",
    "ドレスコード：セミフォーマル／スマートカジュアル。",
    "食事の制限がある方はWhatsAppでお知らせください。",
  ],
  whatsapp: {
    url: "https://chat.whatsapp.com/LLtkoDPyh0EHu7sbK2NxN8",
    label: "WhatsAppグループ",
  },
  photos: {
    url: "https://photos.app.goo.gl/AnAaJKGTeqWx7jtY9",
    label: "共有フォトアルバム",
  },
};

const CONTENT: Record<Locale, WeddingContent> = { en: EN, ja: JA };

export function getContent(locale: Locale): WeddingContent {
  return CONTENT[locale];
}

export function getSignuppableSlotIds(): string[] {
  return EN.schedule
    .flatMap((day) => day.slots)
    .filter((slot) => slot.signupEnabled && slot.id)
    .map((slot) => slot.id!);
}
