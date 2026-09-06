import { StyleSheet } from "react-native";

export const vetHeaderStyles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBlockEnd: 12,
  },
  card: {
    flexBasis: "47%",
    flexGrow: 1,
    borderRadius: 20,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: "rgba(15,23,42,0.7)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  hint: {
    fontSize: 13,
    color: "rgba(15,23,42,0.7)",
  },
});
