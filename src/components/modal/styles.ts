import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.5)",
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
    borderRadius: 24,
    padding: 24,
    backgroundColor: "white",
    gap: 12,
    shadowColor: "#0f172a",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#0f172a" },
  subtitle: { color: "rgba(15,23,42,0.7)" },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#0f172a",
  },
  actionButtonSecondary: {
    backgroundColor: "rgba(15,23,42,0.08)",
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionText: {
    color: "white",
    fontWeight: "600",
  },
  actionTextSecondary: {
    color: "#0f172a",
  },
});
