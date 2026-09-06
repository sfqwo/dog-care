import { StyleSheet } from "react-native";
import { colors, radius, shadows } from "@/src/theme";

export const informerStyles = StyleSheet.create({
  root: { flex: 1 },
  informer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 86,
    minHeight: 48,
    borderRadius: radius.control,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.primary,
    boxShadow: shadows.overlay,
    elevation: 12,
    zIndex: 1000,
  },
  informerInfo: { backgroundColor: colors.primaryPressed },
  informerError: { backgroundColor: colors.danger },
  nonInteractive: { pointerEvents: "none" },
  icon: { color: colors.primaryText },
  text: { flex: 1, color: colors.primaryText, fontSize: 14, fontWeight: "700" },
});
