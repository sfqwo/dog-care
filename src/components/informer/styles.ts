import { StyleSheet } from "react-native";

export const informerStyles = StyleSheet.create({
  root: { flex: 1 },
  informer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 86,
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#166534",
    boxShadow: "0px 8px 14px rgba(15, 23, 42, 0.22)",
    elevation: 12,
    zIndex: 1000,
  },
  informerInfo: { backgroundColor: "#0f4c81" },
  informerError: { backgroundColor: "#991b1b" },
  nonInteractive: { pointerEvents: "none" },
  icon: { color: "white" },
  text: { flex: 1, color: "white", fontSize: 14, fontWeight: "700" },
});
