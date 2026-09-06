export type CarePlanMenuId = "today" | "calendar" | "reminders";

export function getCarePlanMenuRoute(id: CarePlanMenuId) {
  if (id === "today") return "/today";
  if (id === "calendar") return "/calendar";
  return "/reminders";
}
