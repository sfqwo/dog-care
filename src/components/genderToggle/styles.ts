import { StyleSheet } from "react-native";

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
    borderRadius: 18,
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
    borderRadius: 16,
    backgroundColor: "rgba(148,163,184,0.15)",
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
    backgroundColor: "rgba(14,165,233,0.22)",
  },
  toggleOptionPressed: {
    backgroundColor: "rgba(15,23,42,0.08)",
  },
  toggleOptionFirst: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  toggleOptionLast: {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  optionIcon: {
    color: "rgba(15,23,42,0.6)",
  },
  optionIconActive: {
    color: "#0ea5e9",
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(15,23,42,0.7)",
  },
  optionLabelActive: {
    color: "#0f172a",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 4,
  },
});
