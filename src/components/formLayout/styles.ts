import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  stack: {
    gap: 16,
  },
  card: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.95)",
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerContent: {
    flex: 1,
    gap: 6,
  },
  toggleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,23,42,0.06)",
  },
  toggleIcon: {
    color: "#0f172a",
  },
  cardBody: {
    gap: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    color: "rgba(15,23,42,0.7)",
    fontSize: 13,
  },
});
