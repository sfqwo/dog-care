import { Children, createContext, isValidElement, useContext } from "react";
import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";
import type { StatsBlockElement, StatsBlockProps, StatsBlocksProps } from "./types";

const StatsBlocksContext = createContext(false);

const isStatsBlockElement = (
  child: ReactNode
): child is StatsBlockElement => isValidElement(child) && child.type === StatsBlock;

export function StatsBlocks({ children, maxPerRow = 3 }: StatsBlocksProps) {
  const blocks = Children.toArray(children).filter(isStatsBlockElement);

  const rows: StatsBlockElement[][] = [];
  blocks.forEach((child, index) => {
    const rowIndex = Math.floor(index / maxPerRow);
    if (!rows[rowIndex]) rows[rowIndex] = [];
    rows[rowIndex].push(child);
  });

  return (
    <StatsBlocksContext.Provider value={true}>
      <View style={styles.container}>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.statsRow}>
            {row.map((child, childIndex) => (
              <View key={`stat-${rowIndex}-${childIndex}`} style={styles.statCard}>
                <Text style={styles.statLabel}>{child.props.label}</Text>
                <Text style={styles.statValue}>{child.props.value}</Text>
              </View>
            ))}
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
