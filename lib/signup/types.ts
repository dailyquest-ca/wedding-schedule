export interface EventWithCount {
  eventId: string;
  titleEn: string;
  titleJa: string;
  category: string;
  count: number;
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
