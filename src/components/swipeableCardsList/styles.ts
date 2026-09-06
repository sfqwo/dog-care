import { StyleSheet } from "react-native";
import { colors, radius, shadows } from "@/src/theme";

export const styles = StyleSheet.create({
  listContent: { padding: 20, paddingBottom: 48, gap: 20 },
  emptyContainer: {
    marginTop: 12,
    borderRadius: radius.card,
    padding: 20,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: "center",
  },
  defaultAction: {
    backgroundColor: colors.dangerSurface,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    borderRadius: radius.card,
  },
  defaultActionText: {
    color: colors.danger,
    fontWeight: "600",
  },
  cardPressable: {
    borderRadius: radius.card,
    overflow: "hidden",
  },
  cardPressablePressed: {
    transform: [{ scale: 0.98 }],
  },
  card: {
    borderRadius: radius.card,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(123,88,107,0.26)",
    boxShadow: shadows.cardStrong,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  cardTextBlock: {
    flex: 1,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  cardSubtitle: {
    color: colors.textMuted,
    marginTop: 4,
    fontSize: 13,
  },
  durationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "rgba(69,60,65,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  durationValue: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 15,
  },
  noteBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 12,
    borderRadius: radius.control,
    backgroundColor: "rgba(255,255,255,0.42)",
    borderWidth: 1,
    borderColor: "rgba(69,60,65,0.1)",
  },
  noteText: {
    color: colors.textMuted,
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  helperRow: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  helperText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "500",
    flexShrink: 1,
  },
  icon: {
    color: colors.text,
  },
  checkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.secondary,
  },
  checkButtonChecked: {
    backgroundColor: colors.secondary,
  },
  checkButtonDisabled: {
    backgroundColor: colors.surfaceMuted,
    opacity: 0.7,
  },
  checkIcon: {
    color: colors.text,
  },
  checkIconChecked: {
    color: colors.success,
  },
  checkIconDisabled: {
    color: colors.textSubtle,
  },
  checkButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  checkButtonTextDisabled: {
    color: colors.textSubtle,
  },
});
