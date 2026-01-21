import { createContext, ReactNode, useContext } from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";

const HeroCardSectionContext = createContext(false);

type HeroCardRootProps = {
  children: ReactNode;
};

export function HeroCard({ children }: HeroCardRootProps) {
  return (
    <HeroCardSectionContext.Provider value={true}>
      <View style={styles.card}>{children}</View>
    </HeroCardSectionContext.Provider>
  );
}

type HeroCardTextProps = { text: string };

export function HeroCardTitle({ text }: HeroCardTextProps) {
  useHeroCardSectionGuard("HeroCardTitle");
  return <Text style={styles.title}>{text}</Text>;
}

export function HeroCardSubtitle({ text }: HeroCardTextProps) {
  useHeroCardSectionGuard("HeroCardSubtitle");
  return <Text style={styles.subtitle}>{text}</Text>;
}

export function HeroCardBadge({ text }: HeroCardTextProps) {
  useHeroCardSectionGuard("HeroCardBadge");
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

function useHeroCardSectionGuard(componentName: string) {
  const isInHeroCard = useContext(HeroCardSectionContext);
  if (!isInHeroCard) {
    console.warn(`[HeroCard] ${componentName} must be used inside <HeroCard>.`);
  }
}
