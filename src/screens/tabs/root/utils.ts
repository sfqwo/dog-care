export type CarePlanMenuId = "profile" | "calendar" | "vet";

export function getCarePlanMenuRoute(id: CarePlanMenuId) {
  if (id === "profile") return "/profile";
  if (id === "calendar") return "/calendar";
  return "/vet";
}
