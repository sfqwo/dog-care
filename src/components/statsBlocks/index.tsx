import { Children, createContext, isValidElement, useContext } from "react";
import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";
import type { StatsBlockElement, StatsBlockProps, StatsBlocksProps } from "./types";

const StatsBlocksContext = createContext(false);

const isStatsBlockElement = (
  child: ReactNode
): child is StatsBlockElement => isValidElement(child) && child.type === StatsBlock;

export function StatsBlocks({ children }: StatsBlocksProps) {
  const blocks = Children.toArray(children).filter(isStatsBlockElement);

  return (
    <StatsBlocksContext.Provider value={true}>
      <View style={styles.container}>
        {blocks.map((child, index) => (
          <View key={child.key?.toString() ?? `stat-${index}`} style={styles.statCard}>
            <Text
              style={styles.statLabel}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.72}
            >
              {child.props.label}
            </Text>
            <Text
              style={styles.statValue}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.82}
            >
              {child.props.value}
            </Text>
          </View>
        ))}
      </View>
    </StatsBlocksContext.Provider>
  );
}

export function StatsBlock(_: StatsBlockProps) {
  useStatsBlocksGuard("StatsBlock");
  return null;
}

function useStatsBlocksGuard(componentName: string) {
  const isInside = useContext(StatsBlocksContext);
  if (!isInside) {
    console.warn(`[StatsBlocks] ${componentName} must be used inside <StatsBlocks>.`);
  }
}
