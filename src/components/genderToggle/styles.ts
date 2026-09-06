import { StyleSheet } from "react-native";
import { colors, radius } from "@/src/theme";

export const genderToggleStyles = StyleSheet.create({
  wrapper: {
    position: "relative",
    marginTop: 4,
    flex: 1,
    minWidth: 0,
  },
  backgroundInput: {
    width: "100%",
    minHeight: 48,
    borderRadius: radius.input,
  },
  nonInteractive: {
    pointerEvents: "none",
  },
  toggleRow: {
    position: "absolute",
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radius.input,
    backgroundColor: colors.surfaceMuted,
  },
  toggleOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
    backgroundColor: "transparent",
  },
  toggleOptionActive: {
    backgroundColor: colors.secondary,
  },
  toggleOptionPressed: {
    backgroundColor: colors.secondaryPressed,
  },
  toggleOptionFirst: {
    borderTopLeftRadius: radius.input,
    borderBottomLeftRadius: radius.input,
  },
  toggleOptionLast: {
    borderTopRightRadius: radius.input,
    borderBottomRightRadius: radius.input,
  },
  optionIcon: {
    color: colors.textMuted,
  },
  optionIconActive: {
    color: colors.text,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textMuted,
  },
  optionLabelActive: {
    color: colors.text,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 4,
  },
});
