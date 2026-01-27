import { StyleSheet } from "react-native";

export const vetPassportStyles = StyleSheet.create({
  section: {
    gap: 16,
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  tabsContainer: {
    flex: 1,
  },
  addVaccineButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#0ea5e9",
  },
  addVaccineButtonDisabled: {
    opacity: 0.5,
  },
  addVaccineButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  vaccineGroup: {
    gap: 10,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(15,23,42,0.08)",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  listDescription: {
    fontSize: 13,
    color: "rgba(15,23,42,0.7)",
  },
  entryCountLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(15,23,42,0.75)",
  },
  addButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(14,165,233,0.15)",
  },
  addButtonText: {
    fontWeight: "600",
    color: "#0ea5e9",
  },
  listCard: {
    gap: 10,
    borderRadius: 16,
    padding: 12,
    backgroundColor: "rgba(248,250,252,0.9)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
  },
  removeButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(239,68,68,0.1)",
  },
  removeButtonText: {
    color: "#b91c1c",
    fontWeight: "600",
  },
  emptyNote: {
    fontSize: 13,
    color: "rgba(15,23,42,0.6)",
  },
});
