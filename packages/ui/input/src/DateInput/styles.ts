import { StyleSheet } from "react-native";
import { colors, radius } from "@/src/theme";

export const dateInputStyles = StyleSheet.create({
  nonInteractive: {
    pointerEvents: "none",
  },
  invalid: {
    borderColor: colors.danger,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.overlay,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
    borderRadius: radius.card,
    padding: 16,
    gap: 12,
    backgroundColor: colors.surface,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: radius.button,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary,
  },
  confirmButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: radius.button,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  cancelText: {
    color: colors.secondaryText,
    fontSize: 15,
    fontWeight: "700",
  },
  confirmText: {
    color: colors.primaryText,
    fontSize: 15,
    fontWeight: "800",
  },
});
