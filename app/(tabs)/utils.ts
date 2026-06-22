export type CarePlanMenuId = "today" | "reminders";

export function getCarePlanMenuRoute(id: CarePlanMenuId) {
  return id === "today" ? "/today" : "/reminders";
}
