import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 12 },
  card: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
    backgroundColor: '#d7d3d3ff'
},
  row: { flexDirection: "row", gap: 8, alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  button: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, alignItems: "center" },
  title: { fontSize: 20, fontWeight: "600" },
  subtle: { opacity: 0.7 },
  swipeDeleteAction: {
    backgroundColor: "#ffe1e1",
    alignItems: "flex-end",
    justifyContent: "center",
    borderRadius: 12,
    paddingHorizontal: 20,
    minWidth: 96,
  },
  swipeDeleteText: { color: "#a30f2d", fontWeight: "600" },
});
