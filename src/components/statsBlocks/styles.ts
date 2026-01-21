import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { gap: 12 },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  statLabel: {
    color: "rgba(15,23,42,0.6)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
});
