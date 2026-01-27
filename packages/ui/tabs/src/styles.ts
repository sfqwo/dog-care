import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  tabsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tabCard: {
    flexBasis: "48%",
    flexGrow: 1,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(15,23,42,0.04)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
    gap: 4,
  },
  tabCardActive: {
    backgroundColor: "rgba(14,165,233,0.12)",
    borderColor: "rgba(14,165,233,0.5)",
  },
  tabCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  tabHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconPill: {
    width: 30,
    height: 30,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.08)",
  },
  iconPillActive: {
    backgroundColor: "#0ea5e9",
  },
  icon: {
    color: "#0f172a",
  },
  iconActive: {
    color: "white",
  },
  petName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    flex: 1,
  },
  petNameActive: {
    color: "#0c4a6e",
  },
  petMeta: {
    fontSize: 13,
    color: "rgba(15,23,42,0.7)",
  },
  emptyCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: "rgba(15,23,42,0.04)",
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  emptyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(14,165,233,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: {
    color: "#0ea5e9",
  },
  emptyTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: "#0f172a",
  },
  emptySubtitle: {
    color: "rgba(15,23,42,0.65)",
    fontSize: 13,
  },
  segmentContainer: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.15)",
    backgroundColor: "rgba(15,23,42,0.06)",
    overflow: "hidden",
  },
  segmentWrapper: {
    flex: 1,
    flexDirection: "row",
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  segmentButtonActive: {
    backgroundColor: "#0ea5e9",
  },
  segmentButtonPressed: {
    opacity: 0.85,
  },
  segmentText: {
    fontWeight: "600",
    color: "#0f172a",
    fontSize: 12,
  },
  segmentTextActive: {
    color: "white",
  },
  segmentSubtitle: {
    fontSize: 12,
    color: "rgba(15,23,42,0.7)",
  },
  segmentIcon: {
    color: "#0f172a",
  },
  segmentIconActive: {
    color: "white",
  },
  segmentDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(15,23,42,0.15)",
  },
});
