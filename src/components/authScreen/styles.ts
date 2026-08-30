import { StyleSheet } from "react-native";

export const authScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  content: {
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    gap: 28,
  },
  brand: {
    gap: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f766e",
  },
  brandName: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "800",
  },
  title: {
    color: "#0f172a",
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: "#475569",
    fontSize: 15,
    lineHeight: 22,
  },
  form: {
    gap: 14,
  },
  button: {
    minHeight: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    backgroundColor: "#0f172a",
  },
  buttonPressed: {
    opacity: 0.84,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  link: {
    minHeight: 36,
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  linkText: {
    color: "#0f766e",
    fontSize: 14,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  secondaryText: {
    color: "#64748b",
    fontSize: 14,
  },
  error: {
    borderLeftWidth: 3,
    borderLeftColor: "#dc2626",
    paddingLeft: 12,
    color: "#991b1b",
    fontSize: 14,
    lineHeight: 20,
  },
  success: {
    borderLeftWidth: 3,
    borderLeftColor: "#16a34a",
    paddingLeft: 12,
    color: "#166534",
    fontSize: 14,
    lineHeight: 20,
  },
});
