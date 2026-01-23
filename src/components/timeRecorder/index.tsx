import { createContext, useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import type {
  TimeRecorderButtonProps,
  TimeRecorderProps,
  TimeRecorderRowProps,
  TimeRecorderTitleProps,
  TimeRecorderHintProps,
} from "./types";

const TimeRecorderContext = createContext(false);

export function TimeRecorder({ children }: TimeRecorderProps) {
  return (
    <TimeRecorderContext.Provider value={true}>
      <View style={styles.inputCard}>{children}</View>
    </TimeRecorderContext.Provider>
  );
}

export function TimeRecorderTitle({ children }: TimeRecorderTitleProps) {
  useTimeRecorderGuard("TimeRecorderTitle");
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function TimeRecorderRow({ children }: TimeRecorderRowProps) {
  useTimeRecorderGuard("TimeRecorderRow");
  return <View style={styles.inputRow}>{children}</View>;
}

export function TimeRecorderButton({ label, onPress, disabled }: TimeRecorderButtonProps) {
  useTimeRecorderGuard("TimeRecorderButton");
  return (
    <TouchableOpacity
      style={[styles.addButton, disabled && { opacity: 0.4 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.addButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function TimeRecorderHint({ children, visible = true }: TimeRecorderHintProps) {
  useTimeRecorderGuard("TimeRecorderHint");
  if (!visible) return null;
  return <Text style={styles.hintText}>{children}</Text>;
}

function useTimeRecorderGuard(componentName: string) {
  const isInside = useContext(TimeRecorderContext);
  if (!isInside) {
    console.warn(`[TimeRecorder] ${componentName} must be used inside <TimeRecorder>.`);
  }
}
