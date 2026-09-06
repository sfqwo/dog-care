import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 144,
    minWidth: 144,
    borderRadius: 20,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  statLabel: {
    color: "rgba(15,23,42,0.6)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0,
    flexShrink: 1,
  },
  statValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
});
