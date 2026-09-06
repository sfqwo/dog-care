import { StyleSheet } from "react-native";
import { colors, radius } from "@/src/theme";

export const vetPassportStyles = StyleSheet.create({
  section: {
    gap: 16,
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  tabsContainer: {
    flex: 1,
  },
  addVaccineButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
  },
  addVaccineButtonDisabled: {
    opacity: 0.5,
  },
  addVaccineButtonText: {
    color: colors.primaryText,
    fontWeight: "600",
  },
  vaccineGroup: {
    gap: 10,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  addButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  entryCountLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
  },
  addButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.button,
    backgroundColor: colors.secondary,
  },
  addButtonText: {
    fontWeight: "600",
    color: colors.secondaryText,
  },
  listCard: {
    gap: 10,
    borderRadius: radius.control,
    padding: 12,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  removeButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.button,
    backgroundColor: colors.dangerSurface,
  },
  removeButtonText: {
    color: colors.danger,
    fontWeight: "600",
  },
  emptyNote: {
    flex: 1,
    fontSize: 13,
    color: colors.textSubtle,
  },
});
