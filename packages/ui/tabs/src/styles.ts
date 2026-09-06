import { StyleSheet } from "react-native";
import { colors, radius } from "@/src/theme";

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
    borderRadius: radius.control,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  tabCardActive: {
    backgroundColor: colors.accentSurface,
    borderColor: colors.accent,
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
    borderRadius: radius.pill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondary,
  },
  iconPillActive: {
    backgroundColor: colors.accent,
  },
  icon: {
    color: colors.text,
  },
  iconActive: {
    color: colors.primaryText,
  },
  petName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
  },
  petNameActive: {
    color: colors.text,
  },
  petMeta: {
    fontSize: 13,
    color: colors.textMuted,
  },
  petMetaActive: {
    color: colors.accent,
  },
  emptyCard: {
    borderRadius: radius.card,
    padding: 16,
    backgroundColor: colors.surfaceMuted,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  emptyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: {
    color: colors.text,
  },
  emptyTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: colors.text,
  },
  emptySubtitle: {
    color: colors.textMuted,
    fontSize: 13,
  },
  segmentContainer: {
    flexDirection: "row",
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
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
    backgroundColor: colors.primary,
  },
  segmentButtonPressed: {
    opacity: 0.85,
  },
  segmentText: {
    fontWeight: "600",
    color: colors.text,
    fontSize: 12,
  },
  segmentTextActive: {
    color: colors.primaryText,
  },
  segmentSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  segmentIcon: {
    color: colors.text,
  },
  segmentIconActive: {
    color: colors.primaryText,
  },
  segmentDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});
