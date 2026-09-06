import { StyleSheet } from "react-native";
import { colors, radius } from "@/src/theme";

export const styles = StyleSheet.create({
  trigger: {
    minHeight: 52,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  triggerPressed: {
    opacity: 0.85,
  },
  triggerDisabled: {
    opacity: 0.5,
  },
  triggerInvalid: {
    borderColor: colors.danger,
  },
  label: {
    fontSize: 16,
    color: colors.text,
  },
  placeholder: {
    color: colors.textSubtle,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
    gap: 12,
    flex: 1,
    maxHeight: "100%",
    marginTop: 48,
  },
  sheetHandle: {
    width: 56,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.borderStrong,
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  modalHeader: {
    paddingHorizontal: 4,
    paddingBlockEnd: 30,
    gap: 8,
    width: "100%",
    backgroundColor: colors.surface,
  },
  optionsList: {
    borderRadius: radius.card,
    flex: 1,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionLast: {
    borderBottomWidth: 0,
  },
  optionTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "600",
  },
  optionText: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: 2,
  },
  optionDescription: {
    fontSize: 13,
    color: colors.textSubtle,
    marginTop: 2,
  },
  cancelButton: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: radius.button,
    backgroundColor: colors.secondary,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.secondaryText,
  },
});
