import { createContext, ReactNode, useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

const TimeRecorderContext = createContext(false);

type TimeRecorderProps = {
  children: ReactNode;
};

export function TimeRecorder({ children }: TimeRecorderProps) {
  return (
    <TimeRecorderContext.Provider value={true}>
      <View style={styles.inputCard}>{children}</View>
    </TimeRecorderContext.Provider>
  );
}

type TimeRecorderTitleProps = {
  children: ReactNode;
};

export function TimeRecorderTitle({ children }: TimeRecorderTitleProps) {
  useTimeRecorderGuard("TimeRecorderTitle");
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

type TimeRecorderRowProps = {
  children: ReactNode;
};

export function TimeRecorderRow({ children }: TimeRecorderRowProps) {
  useTimeRecorderGuard("TimeRecorderRow");
  return <View style={styles.inputRow}>{children}</View>;
}

type TimeRecorderButtonProps = {
  label: ReactNode;
  onPress: () => void;
  disabled?: boolean;
};

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

function useTimeRecorderGuard(componentName: string) {
  const isInside = useContext(TimeRecorderContext);
  if (!isInside) {
    console.warn(`[TimeRecorder] ${componentName} must be used inside <TimeRecorder>.`);
  }
}
