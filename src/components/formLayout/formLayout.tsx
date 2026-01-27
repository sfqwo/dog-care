import { createContext, useContext } from "react";
import { Text, View } from "react-native";
import { styles } from './styles';
import { FormCardProps, FormCardSubtitleProps, FormCardTitleProps, FormStackProps } from "./types";

const FormCardContext = createContext(false);

export function FormStack({ children }: FormStackProps) {
  return <View style={styles.stack}>{children}</View>;
}

export function FormCard({ children }: FormCardProps) {
  return (
    <FormCardContext.Provider value={true}>
      <View style={styles.card}>{children}</View>
    </FormCardContext.Provider>
  );
}

export function FormCardTitle({ children }: FormCardTitleProps) {
  useFormCardGuard("FormCardTitle");
  return <Text style={styles.title}>{children}</Text>;
}

export function FormCardSubtitle({ children }: FormCardSubtitleProps) {
  useFormCardGuard("FormCardSubtitle");
  return <Text style={styles.subtitle}>{children}</Text>;
}

function useFormCardGuard(componentName: string) {
  const isInside = useContext(FormCardContext);
  if (!isInside) {
    console.warn(`[FormCard] ${componentName} must be used inside <FormCard>.`);
  }
}
