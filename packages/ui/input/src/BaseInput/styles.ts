import { StyleSheet } from "react-native";
import { colors, radius } from "@/src/theme";

export const styles = StyleSheet.create({
  base: {
    flex: 1,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    minHeight: 46,
    fontSize: 16,
    color: colors.text,
  },
  note: {
    minHeight: 48,
  },
  invalid: {
    borderColor: colors.danger,
  },
});
