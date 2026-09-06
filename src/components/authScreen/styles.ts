import { StyleSheet } from "react-native";
import { colors, radius } from "@/src/theme";

export const authScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  content: {
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    gap: 28,
  },
  brand: {
    gap: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.control,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  brandName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  form: {
    gap: 14,
  },
  button: {
    minHeight: 50,
    borderRadius: radius.button,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    backgroundColor: colors.primary,
  },
  buttonPressed: {
    opacity: 0.84,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: colors.primaryText,
    fontSize: 15,
    fontWeight: "800",
  },
  link: {
    minHeight: 36,
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  linkText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  secondaryText: {
    color: colors.textSubtle,
    fontSize: 14,
  },
  error: {
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
    paddingLeft: 12,
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
  },
  success: {
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
    paddingLeft: 12,
    color: colors.success,
    fontSize: 14,
    lineHeight: 20,
  },
});
