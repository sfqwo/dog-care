import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  trigger: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  triggerPressed: {
    opacity: 0.85,
  },
  triggerDisabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    color: "#111827",
  },
  placeholder: {
    color: "#9ca3afca",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
    gap: 12,
    flex: 1,
    maxHeight: "100%",
    marginTop: 48,
  },
  sheetHandle: {
    width: 56,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D4D4D8",
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
    textAlign: "center",
  },
  modalHeader: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 8,
  },
  optionsList: {
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    flex: 1,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E4E4E7",
  },
  optionLast: {
    borderBottomWidth: 0,
  },
  optionTitle: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },
  optionText: {
    fontSize: 15,
    color: "#374151",
    marginTop: 2,
  },
  optionDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  cancelButton: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
});
