import { StyleSheet } from "react-native";

export const weightSectionStyles = StyleSheet.create({
  section: {
    gap: 16,
  },
  chartCard: {
    borderRadius: 22,
    padding: 18,
    gap: 14,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  chartHeader: {
    gap: 4,
  },
  chartTitle: {
    color: "#0f172a",
    fontSize: 17,
    fontWeight: "700",
  },
  chartSubtitle: {
    color: "rgba(15,23,42,0.65)",
    fontSize: 13,
  },
  chartBars: {
    minHeight: 132,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  chartSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  chartBar: {
    width: "100%",
    maxWidth: 28,
    minHeight: 18,
    borderRadius: 999,
    backgroundColor: "#2563eb",
  },
  chartBarCurrent: {
    backgroundColor: "#16a34a",
  },
  chartWeight: {
    color: "#0f172a",
    fontSize: 11,
    fontWeight: "700",
  },
  chartDate: {
    color: "rgba(15,23,42,0.55)",
    fontSize: 10,
  },
  chartEmpty: {
    minHeight: 112,
    justifyContent: "center",
    borderRadius: 18,
    padding: 18,
    backgroundColor: "rgba(15,23,42,0.05)",
  },
  chartEmptyText: {
    color: "rgba(15,23,42,0.65)",
    textAlign: "center",
  },
});
