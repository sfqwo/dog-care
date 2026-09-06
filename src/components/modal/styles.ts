import { StyleSheet } from "react-native";
import { colors, radius, shadows } from "@/src/theme";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    padding: 24,
  },
  cardWrapper: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 420,
    maxHeight: "90%",
  },
  card: {
    borderRadius: radius.card,
    padding: 24,
    backgroundColor: colors.surface,
    gap: 12,
    boxShadow: shadows.overlay,
    elevation: 12,
  },
  title: { fontSize: 20, fontWeight: "700", color: colors.text },
  subtitle: { color: colors.textMuted },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
  },
  actionButtonSecondary: {
    backgroundColor: colors.secondary,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionText: {
    color: colors.primaryText,
    fontWeight: "600",
  },
  actionTextSecondary: {
    color: colors.secondaryText,
  },
});
