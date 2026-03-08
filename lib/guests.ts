export interface Guest {
  id: string;
  firstName: string;
  isFamilyException: boolean;
}

export const GUESTS: Guest[] = [
  { id: "anna", firstName: "Anna", isFamilyException: true },
  { id: "zak", firstName: "Zak", isFamilyException: true },
  { id: "takaaki", firstName: "Takaaki", isFamilyException: true },
  { id: "yoko", firstName: "Yoko", isFamilyException: true },
  { id: "ishan", firstName: "Ishan", isFamilyException: false },
  { id: "roxy", firstName: "Roxy", isFamilyException: false },
  { id: "romeo", firstName: "Romeo", isFamilyException: false },
  { id: "talia", firstName: "Talia", isFamilyException: false },
  { id: "maki", firstName: "Maki", isFamilyException: false },
  { id: "naito", firstName: "Naito", isFamilyException: false },
  { id: "krystal", firstName: "Krystal", isFamilyException: false },
  { id: "keith", firstName: "Keith", isFamilyException: false },
  { id: "kento", firstName: "Kento", isFamilyException: false },
  { id: "haruna", firstName: "Haruna", isFamilyException: false },
  { id: "lance", firstName: "Lance", isFamilyException: false },
  { id: "melody", firstName: "Melody", isFamilyException: false },
  { id: "victor", firstName: "Victor", isFamilyException: false },
  { id: "ami", firstName: "Ami", isFamilyException: false },
  { id: "nameet", firstName: "Nameet", isFamilyException: false },
  { id: "michelle", firstName: "Michelle", isFamilyException: false },
  { id: "jeff", firstName: "Jeff", isFamilyException: false },
];

export function getGuestById(id: string): Guest | undefined {
  return GUESTS.find((g) => g.id === id);
}

export function getDisplayName(guest: Guest, locale: "en" | "ja"): string {
  if (locale === "ja" && !guest.isFamilyException) {
    return `${guest.firstName}様`;
  }
  return guest.firstName;
}
