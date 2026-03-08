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
  subtitle: "Cancún, Mexico · April 5–13, 2026",
  toggleLabel: "日本語",
  schedule: [
    {
      dateLabel: "Sun, Apr 5",
      dayLabel: "Sunday — First Feet on the Sand",
      slots: [
        {
          time: "9:30 AM onward",
          label: "First crew lands",
          description: "Ami, Nameet, Michelle, and Jeff arrive today.",
          category: "travel",
        },
        {
          time: "Evening",
          label: "Sunset drinks & lobby meetup",
          description:
            "No agenda — grab a drink, find a pool chair, and ease into vacation mode.",
          category: "free",
        },
      ],
    },
    {
      dateLabel: "Mon, Apr 6",
      dayLabel: "Monday — The Whole Crew Arrives",
      slots: [
        {
          time: "2:53–4:04 PM",
          label: "Big arrival wave",
          description:
            "Anna, Zak, Ishan, Roxy, Romeo, Talia, Maki, Naito, Krystal, and Keith touch down.",
          category: "travel",
        },
        {
          time: "Evening",
          label: "Icebreaker & resort exploration",
          description:
            "Meet everyone, explore the grounds, and make sure nobody feels like a stranger by the end of the night.",
          category: "free",
        },
      ],
    },
    {
      dateLabel: "Tue, Apr 7",
      dayLabel: "Tuesday — Island Adventure",
      slots: [
        {
          time: "12:50 PM onward",
          label: "Final guest arrivals",
          description:
            "Takaaki, Yoko, Kento, Haruna, Lance, Melody, and Victor arrive today.",
          category: "travel",
        },
        {
          time: "Daytime",
          label: "Catamaran to Isla Mujeres",
          description:
            "Sail out, motorbike the island, and catch one of the resort's themed events.",
          category: "excursion",
        },
        {
          time: "6:30 PM",
          label: "Group dinner at the buffet (tentative)",
          description: "Still deciding — we'll confirm closer to the date.",
          category: "dinner",
        },
        {
          time: "Late evening",
          label: "Resort disco night",
          description: "If the vibe is right, the dance floor awaits.",
          category: "free",
        },
      ],
    },
    {
      dateLabel: "Wed, Apr 8",
      dayLabel: "Wednesday — Recharge & Family Time",
      slots: [
        {
          time: "All day",
          label: "Your day, your way",
          description:
            "Beach, pool, spa, or hammock nap — pick your own adventure.",
          category: "free",
        },
        {
          time: "Afternoon",
          label: "Beach volleyball showdown",
          description: "Friendly tournament on the sand. Bragging rights only.",
          category: "excursion",
        },
        {
          time: "Afternoon",
          label: "Anna & Zak — family time",
          description: "Anna's family arrived yesterday; we'll be catching up with them.",
          category: "busy",
        },
        {
          time: "Evening",
          label: "Pre-wedding dinner together",
          description: "Casual group dinner the night before the big day.",
          category: "dinner",
        },
      ],
    },
    {
      dateLabel: "Thu, Apr 9",
      dayLabel: "Thursday — The Big Day",
      slots: [
        {
          time: "1:00–5:00 PM",
          label: "Glam squad, pep talks & photos",
          description:
            "Friends rally, cameras flash, and we get ready for the moment.",
          category: "busy",
        },
        {
          time: "5:00 PM",
          label: "Ceremony @ Sky Terrace",
          description: "Arrive a few minutes early — it's go time.",
          category: "wedding",
        },
        {
          time: "5:30 PM",
          label: "Photos & Cocktails @ Sky Terrace",
          description:
            "Wedding party and family photos while everyone else grabs a drink.",
          category: "wedding",
        },
        {
          time: "7:00 PM",
          label: "Private Dinner & Speeches @ Sky Terrace",
          description: "Seated dinner for everyone, speeches, and maybe a few surprises.",
          category: "wedding",
        },
        {
          time: "9:00–11:00 PM",
          label: "Open Bar & Dance Party @ Sky Terrace",
          description: "Shoes optional. Dancing mandatory.",
          category: "wedding",
        },
        {
          time: "11:00 PM+",
          label: "After-party — sunrise edition",
          description: "Ocean hangout or room party — we stop when the sun comes up.",
          category: "free",
        },
      ],
    },
    {
      dateLabel: "Fri, Apr 10",
      dayLabel: "Friday — You Earned This",
      slots: [
        {
          time: "All day",
          label: "Sleep in & pool vibes",
          description: "Zero obligations. Maximum lounging. Brunch whenever you surface.",
          category: "free",
        },
        {
          time: "Afternoon",
          label: "Victor heads out",
          description: "Victor departs today.",
          category: "travel",
        },
        {
          time: "Evening",
          label: "Sunset tacos & storytelling",
          description: "Low-key evening hangout — swap your best stories from the week so far.",
          category: "dinner",
        },
      ],
    },
    {
      dateLabel: "Sat, Apr 11",
      dayLabel: "Saturday — Golf, Games & Nightlife",
      slots: [
        {
          time: "Morning",
          label: "Scramble golf tournament",
          description: "No handicap needed — just show up and swing.",
          category: "excursion",
        },
        {
          time: "Afternoon",
          label: "Pool volleyball cooldown",
          description: "Jump in, cool off, and settle any unfinished scores.",
          category: "free",
        },
        {
          time: "2:58 PM onward",
          label: "Farewell to the second wave",
          description:
            "Takaaki, Yoko, Kento, Haruna, Lance, Melody, Michelle, and Jeff depart today.",
          category: "travel",
        },
        {
          time: "Evening",
          label: "Cancun night out — Coco Bongo",
          description: "Legendary nightclub. Need we say more?",
          category: "excursion",
        },
      ],
    },
    {
      dateLabel: "Sun, Apr 12",
      dayLabel: "Sunday — One Last Adventure",
      slots: [
        {
          time: "Daytime",
          label: "Pick your thrill",
          description:
            "Jet skis, boat rental, scuba diving, or an adventure park — your call.",
          category: "excursion",
        },
        {
          time: "5:05 PM",
          label: "Ami and Nameet head home",
          category: "travel",
        },
        {
          time: "Evening",
          label: "Final dinner together",
          description: "The farewell feast. One table, all of us, one more time.",
          category: "dinner",
        },
      ],
    },
    {
      dateLabel: "Mon, Apr 13",
      dayLabel: "Monday — Until Next Time",
      slots: [
        {
          time: "Morning",
          label: "Last breakfast, long hugs",
          description: "Slow morning. Say your goodbyes the way you mean them.",
          category: "free",
        },
        {
          time: "4:05–5:00 PM",
          label: "Everyone heads home",
          description:
            "Anna, Zak, Ishan, Roxy, Romeo, Talia, Maki, Naito, Krystal, and Keith head home.",
          category: "travel",
        },
      ],
    },
  ],
  notes: [
    "The wedding is Thursday, April 9, 2026.",
    "Flight times are approximate windows — don't panic if yours shifts a little.",
    "Dress code: semi-formal / smart casual. Look good, feel good.",
    "Any dietary needs? Drop a note in the WhatsApp group so we can plan ahead.",
  ],
  costs: [
    { label: "Wedding events", amount: "Included" },
    { label: "Shared dinners", amount: "Mostly included" },
    { label: "Personal extras", amount: "On your own" },
  ],
  whatsapp: {
    url: "https://chat.whatsapp.com/example-group-link",
    label: "Join our WhatsApp group",
  },
};

const JA: WeddingContent = {
  title: "A & Z ウェディング",
  subtitle: "カンクン、メキシコ · 2026年4月5日〜13日",
  toggleLabel: "English",
  schedule: [
    {
      dateLabel: "4月5日（日）",
      dayLabel: "日曜日 — 最初の一歩",
      slots: [
        {
          time: "9:30以降",
          label: "先発チーム到着",
          description:
            "Ami様、Nameet様、Michelle様、Jeff様 が本日到着します。",
          category: "travel",
        },
        {
          time: "夜",
          label: "サンセットドリンク＆ロビー集合",
          description: "予定なし — ドリンク片手にバカンスモードへ。",
          category: "free",
        },
      ],
    },
    {
      dateLabel: "4月6日（月）",
      dayLabel: "月曜日 — 全員集合",
      slots: [
        {
          time: "14:53–16:04",
          label: "メインの到着ウェーブ",
          description:
            "Anna、Zak、Ishan様、Roxy様、Romeo様、Talia様、Maki様、Naito様、Krystal様、Keith様 が午後に到着します。",
          category: "travel",
        },
        {
          time: "夜",
          label: "アイスブレイカー＆リゾート探検",
          description:
            "みんなで集まって、今夜のうちに打ち解けましょう。",
          category: "free",
        },
      ],
    },
    {
      dateLabel: "4月7日（火）",
      dayLabel: "火曜日 — 島アドベンチャー",
      slots: [
        {
          time: "12:50以降",
          label: "最後のゲスト到着",
          description:
            "Takaaki、Yoko、Kento様、Haruna様、Lance様、Melody様、Victor様 が本日到着します。",
          category: "travel",
        },
        {
          time: "日中",
          label: "カタマランでIsla Mujeresへ",
          description:
            "船で出発、島をバイクで一周、リゾートのテーマイベントも。",
          category: "excursion",
        },
        {
          time: "18:30",
          label: "ビュッフェでグループディナー（仮）",
          description: "検討中 — 日程が近づいたらお知らせします。",
          category: "dinner",
        },
        {
          time: "深夜",
          label: "リゾートディスコナイト",
          description: "ノリが良ければ、ダンスフロアへ。",
          category: "free",
        },
      ],
    },
    {
      dateLabel: "4月8日（水）",
      dayLabel: "水曜日 — 休息＆ファミリータイム",
      slots: [
        {
          time: "終日",
          label: "自分スタイルの一日",
          description:
            "ビーチ、プール、スパ、ハンモック昼寝 — お好みのアドベンチャーを。",
          category: "free",
        },
        {
          time: "午後",
          label: "ビーチバレー対決",
          description: "砂浜でフレンドリートーナメント。自慢権のみ。",
          category: "excursion",
        },
        {
          time: "午後",
          label: "Anna & Zak — ファミリータイム",
          description: "Annaの家族が昨日到着。一緒に過ごす時間です。",
          category: "busy",
        },
        {
          time: "夜",
          label: "前夜祭ディナー",
          description: "本番前夜、みんなでカジュアルディナー。",
          category: "dinner",
        },
      ],
    },
    {
      dateLabel: "4月9日（木）",
      dayLabel: "木曜日 — いよいよ本番",
      slots: [
        {
          time: "13:00–17:00",
          label: "おめかし・気合い・写真撮影",
          description:
            "友人に励まされ、カメラが回り、最高の瞬間に備えます。",
          category: "busy",
        },
        {
          time: "17:00",
          label: "挙式 @ Sky Terrace",
          description: "少し早めにお越しください — いよいよです。",
          category: "wedding",
        },
        {
          time: "17:30",
          label: "写真撮影＆カクテル @ Sky Terrace",
          description:
            "新郎新婦と家族の写真。他のゲストはドリンクをどうぞ。",
          category: "wedding",
        },
        {
          time: "19:00",
          label: "プライベートディナー＆スピーチ @ Sky Terrace",
          description: "着席ディナー、スピーチ、サプライズもあるかも。",
          category: "wedding",
        },
        {
          time: "21:00–23:00",
          label: "オープンバー＆ダンスパーティー @ Sky Terrace",
          description: "靴は任意。ダンスは必須。",
          category: "wedding",
        },
        {
          time: "23:00以降",
          label: "アフターパーティー — サンライズ・エディション",
          description: "海辺で語らいやルームパーティー — 朝日が昇るまで。",
          category: "free",
        },
      ],
    },
    {
      dateLabel: "4月10日（金）",
      dayLabel: "金曜日 — ご褒美デー",
      slots: [
        {
          time: "終日",
          label: "朝寝坊＆プール三昧",
          description: "予定ゼロ。のんびり最大限。ブランチはお好きな時に。",
          category: "free",
        },
        {
          time: "午後",
          label: "Victor様 出発",
          description: "Victor様 は本日出発します。",
          category: "travel",
        },
        {
          time: "夜",
          label: "サンセットタコス＆語り合い",
          description: "のんびり夜タイム — 今週のベストエピソードを語り合おう。",
          category: "dinner",
        },
      ],
    },
    {
      dateLabel: "4月11日（土）",
      dayLabel: "土曜日 — ゴルフ、ゲーム＆ナイトライフ",
      slots: [
        {
          time: "朝",
          label: "スクランブルゴルフトーナメント",
          description: "ハンデ不要 — 来て振るだけでOK。",
          category: "excursion",
        },
        {
          time: "午後",
          label: "プールバレーでクールダウン",
          description: "飛び込んで涼んで、決着をつけよう。",
          category: "free",
        },
        {
          time: "14:58以降",
          label: "第二陣のお見送り",
          description:
            "Takaaki、Yoko、Kento様、Haruna様、Lance様、Melody様、Michelle様、Jeff様 が本日出発します。",
          category: "travel",
        },
        {
          time: "夜",
          label: "カンクンナイトアウト — Coco Bongo",
          description: "伝説のナイトクラブ。それ以上の説明は不要。",
          category: "excursion",
        },
      ],
    },
    {
      dateLabel: "4月12日（日）",
      dayLabel: "日曜日 — 最後のアドベンチャー",
      slots: [
        {
          time: "日中",
          label: "スリルを選ぼう",
          description:
            "ジェットスキー、ボートレンタル、スキューバダイビング、アドベンチャーパーク — あなた次第。",
          category: "excursion",
        },
        {
          time: "17:05",
          label: "Ami様 と Nameet様 帰国",
          category: "travel",
        },
        {
          time: "夜",
          label: "最後のディナー",
          description: "フェアウェルの宴。一つのテーブル、全員で、もう一度。",
          category: "dinner",
        },
      ],
    },
    {
      dateLabel: "4月13日（月）",
      dayLabel: "月曜日 — また会う日まで",
      slots: [
        {
          time: "朝",
          label: "最後の朝食、長いハグ",
          description: "ゆっくり朝を過ごして、心を込めてお別れを。",
          category: "free",
        },
        {
          time: "16:05–17:00",
          label: "みんな帰路へ",
          description:
            "Anna、Zak、Ishan様、Roxy様、Romeo様、Talia様、Maki様、Naito様、Krystal様、Keith様 が帰国します。",
          category: "travel",
        },
      ],
    },
  ],
  notes: [
    "結婚式は2026年4月9日（木）です。",
    "フライト時刻は目安です — 多少ずれても心配なく。",
    "ドレスコード：セミフォーマル／スマートカジュアル。おしゃれして楽しんで。",
    "食事の制限がある方はWhatsAppグループでお知らせください。",
  ],
  costs: [
    { label: "ウェディング関連", amount: "含まれています" },
    { label: "共有ディナー", amount: "ほぼ含まれています" },
    { label: "個人の追加費用", amount: "各自負担" },
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
