import { Text } from "react-native";

import { styles } from './styles';
import type { HintProps } from "./types";

export function Hint({ children, visible = true }: HintProps) {
  if (!visible) return null;
  return <Text style={styles.hintText}>{children}</Text>;
}