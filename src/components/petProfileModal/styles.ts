import { StyleSheet } from "react-native";

export const petProfileModalStyles = StyleSheet.create({
  inlineRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "stretch",
  },
  inlineInput: {
    flex: 1,
  },
  unitInputWrapper: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
  },
  unitInput: {
    paddingRight: 42,
  },
  weightUnit: {
    position: "absolute",
    right: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
});
