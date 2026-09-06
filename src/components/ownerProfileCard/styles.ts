import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    gap: 16,
    boxShadow: "0px 10px 18px rgba(15, 23, 42, 0.12)",
    elevation: 6,
  },
  title: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  infoLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    color: "rgba(15,23,42,0.55)",
    fontSize: 14,
  },
  infoValue: {
    color: "#0f172a",
    fontWeight: "600",
  },
  button: {
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#8b5cf6",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
});
