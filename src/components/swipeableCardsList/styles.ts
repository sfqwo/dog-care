import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  listContent: { padding: 20, paddingBottom: 48, gap: 20 },
  emptyContainer: {
    marginTop: 12,
    borderRadius: 20,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
  },
  emptyText: {
    color: "rgba(15,23,42,0.8)",
    textAlign: "center",
  },
  defaultAction: {
    backgroundColor: "#ffe1e1",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    borderRadius: 22,
  },
  defaultActionText: {
    color: "#a30f2d",
    fontWeight: "600",
  },
  cardPressable: {
    borderRadius: 22,
    overflow: "hidden",
  },
  cardPressablePressed: {
    transform: [{ scale: 0.98 }],
  },
  card: {
    borderRadius: 22,
    padding: 18,
    gap: 14,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  cardTitle: {
    color: "#0f172a",
    fontSize: 17,
    fontWeight: "700",
  },
  cardSubtitle: {
    color: "rgba(15, 23, 42, 0.7)",
    marginTop: 4,
    fontSize: 13,
  },
  durationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  durationValue: {
    color: "#0f172a",
    fontWeight: "700",
    fontSize: 15,
  },
  noteBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.55)",
  },
  noteText: {
    color: "#1f2937",
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  helperText: {
    color: "#0f172a",
    fontSize: 12,
    fontWeight: "500",
  },
  icon: {
    color: "#0f172a",
  },
});
