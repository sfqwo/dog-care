import { ColorValue, StyleSheet } from "react-native";

export const profileStyles = StyleSheet.create({
  screenGradient: { flex: 1 },
  safeArea: { flex: 1 },
  contentGap: { gap: 18 },
  formCard: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    gap: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  button: {
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#8b5cf6",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  buttonSecondary: {
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.08)",
  },
  buttonSecondaryText: {
    color: "#0f172a",
    fontWeight: "600",
    fontSize: 14,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 6,
  },
  editingLabel: {
    color: "#0f172a",
    fontWeight: "600",
  },
});

export const pageGradient: [ColorValue, ColorValue] = ["#ecfeff", "#f5f3ff"];

export const petGradient = ["#e0f2fe", "#fef9c3", "#fde68a"] as const;
