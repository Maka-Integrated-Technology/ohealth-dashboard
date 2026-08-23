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