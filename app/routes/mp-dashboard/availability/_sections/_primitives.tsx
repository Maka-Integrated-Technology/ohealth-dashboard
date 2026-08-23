export function getWeekStart(date: Date): Date {
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(date);
  start.setDate(date.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function formatWeekLabel(start: Date): string {
  const end = new Date(start);
  end.setDate(start.getDate() + 5);
  const sameMonth = start.getMonth() === end.getMonth();
  const startLabel = start.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const endLabel = sameMonth
    ? end.getDate().toString()
    : end.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  return `${startLabel}-${endLabel}, ${end.getFullYear()}`;
}

export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getMonthGridDays(monthStart: Date): Date[] {
  const firstOfMonth = new Date(monthStart);
  const dayOfWeek = firstOfMonth.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() + diffToMonday);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }
  return days;
}
