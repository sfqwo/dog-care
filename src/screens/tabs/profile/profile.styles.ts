import { ColorValue, StyleSheet } from "react-native";
import { colors, gradients, radius } from "@/src/theme";

export const profileStyles = StyleSheet.create({
  screenGradient: { flex: 1 },
  safeArea: { flex: 1 },
  contentGap: { gap: 18 },
  formCard: {
    borderRadius: radius.card,
    padding: 20,
    backgroundColor: colors.surfaceRaised,
    gap: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  button: {
    borderRadius: radius.button,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: colors.primaryText,
    fontWeight: "700",
    fontSize: 15,
  },
  buttonSecondary: {
    borderRadius: radius.button,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: colors.secondary,
  },
  buttonSecondaryText: {
    color: colors.secondaryText,
    fontWeight: "600",
    fontSize: 14,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  editingLabel: {
    color: colors.text,
    fontWeight: "600",
  },
  accountSection: {
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  accountText: {
    flex: 1,
    gap: 4,
  },
  accountEmail: {
    color: colors.textSubtle,
    fontSize: 14,
  },
  signOutButton: {
    minHeight: 40,
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: colors.dangerSurface,
  },
  signOutButtonText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "700",
  },
});

export const pageGradient: [ColorValue, ColorValue] = gradients.page;

export const petGradient = gradients.cardWarm;
