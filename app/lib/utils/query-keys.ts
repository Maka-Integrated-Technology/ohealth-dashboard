export type SearchParams = {
  [key: string]: string | number | boolean | undefined;
};

export const QUERY_KEYS = {
  example: {
    all: ["example"] as const,
    list: (params: SearchParams) => ["example", "list", params] as const,
    byId: (id: string | number) => ["example", id] as const,
  },
  appointments: {
    all: ["appointments"] as const,
    next: () => ["appointments", "next"] as const,
    today: () => ["appointments", "today"] as const,
    upcoming: () => ["appointments", "upcoming"] as const,
    requests: () => ["appointments", "requests"] as const,
    list: (params: SearchParams) => ["appointments", "list", params] as const,
    consultation: (id: string) => ["appointments", "consultation", id] as const,
  },
  profileSetup: {
    status: () => ["profile-setup", "status"] as const,
  },
  reviews: {
    all: () => ["reviews"] as const,
  },
};
