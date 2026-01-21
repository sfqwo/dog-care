import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 30,
    padding: 24,
    backgroundColor: "rgba(255,255,255,0.95)",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 7,
    gap: 10,
  },
  title: { fontSize: 24, fontWeight: "800", color: "#0f172a" },
  subtitle: { color: "rgba(15,23,42,0.7)", fontSize: 14 },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#fdf2f8",
    marginTop: 6,
  },
  badgeText: { color: "#a30f2d", fontWeight: "700", fontSize: 11, letterSpacing: 0.6 },
});
