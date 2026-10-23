// Pure URL-state helpers for laboratory preview lists. Keep defaults out of
// shareable links, preserve unrelated parameters and reset stale pagination.
export function labParam(
  params: URLSearchParams,
  name: string,
  allowed?: readonly string[],
  fallback = ""
): string {
  const value = params.get(name) ?? fallback;
  return allowed && !allowed.includes(value) ? fallback : value;
}

export function labListParams(
  current: URLSearchParams,
  name: string,
  value: string,
  fallback = ""
): URLSearchParams {
  const next = new URLSearchParams(current);
  const trimmed = value.trim();
  if (!trimmed || trimmed === fallback) next.delete(name);
  else next.set(name, trimmed);
  if (name !== "page") next.delete("page");
  return next;
}

export function labTextMatch(values: readonly string[], query: string): boolean {
  const needle = query.trim().toLocaleLowerCase();
  return values.some((value) => value.toLocaleLowerCase().includes(needle));
}

export function labStaffMatch(
  staff: {
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    lastActive: string;
  },
  search: string
): boolean {
  return labTextMatch(
    [staff.name, staff.email, staff.phone, staff.role, staff.status, staff.lastActive],
    search
  );
}

export function labUniqueEmail(
  members: readonly { id: string; email: string }[],
  email: string,
  editedId: string | null
): boolean {
  const normalized = email.trim().toLocaleLowerCase();
  return !members.some(
    (member) =>
      member.id !== editedId &&
      member.email.trim().toLocaleLowerCase() === normalized
  );
}

export function labReplaceById<T extends { id: string }>(
  records: readonly T[],
  replacement: T
): T[] {
  return records.map((record) =>
    record.id === replacement.id ? replacement : record
  );
}

export function labWithNotificationRead<T extends { id: string; unread: boolean }>(
  records: readonly T[],
  id: string
): T[] {
  return records.map((record) =>
    record.id === id ? { ...record, unread: false } : record
  );
}
