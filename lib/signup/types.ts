export interface EventWithCount {
  eventId: string;
  titleEn: string;
  titleJa: string;
  category: string;
  count: number;
  signupEnabled: boolean;
}

export interface SignupRecord {
  eventId: string;
  guestId: string;
  createdAt: string;
}

export interface EventRoster {
  eventId: string;
  titleEn: string;
  count: number;
  guests: { guestId: string; firstName: string }[];
}

export interface DbEvent {
  id: string;
  dayDate: string;
  timeLabel: string;
  category: string;
  signupEnabled: boolean;
  active: boolean;
  source: "base" | "custom";
}

export interface DbEventI18n {
  eventId: string;
  locale: "en" | "ja";
  label: string;
  description: string | null;
}

export interface DbEventFull extends DbEvent {
  labelEn: string;
  descriptionEn: string | null;
  labelJa: string;
  descriptionJa: string | null;
}

export interface PublicContentResponse {
  events: DbEventFull[];
  notes: { en: string[]; ja: string[] };
}
