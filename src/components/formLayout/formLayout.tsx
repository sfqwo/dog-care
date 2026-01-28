import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { styles } from "./styles";
import {
  FormCardProps,
  FormCardSubtitleProps,
  FormCardTitleProps,
  FormStackProps,
} from "./types";

const FormCardContext = createContext(false);

export function FormStack({ children }: FormStackProps) {
  return <View style={styles.stack}>{children}</View>;
}

export function FormCard({
  children,
  collapsible = true,
  defaultCollapsed = false,
}: FormCardProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const { headerElements, bodyElements } = useMemo(() => {
    const headerList: ReactNode[] = [];
    const bodyList: ReactNode[] = [];
    let headerComplete = !collapsible;

    Children.forEach(children, (child) => {
      if (!collapsible) {
        bodyList.push(child);
        return;
      }

      if (!headerComplete && isHeaderElement(child)) {
        headerList.push(child);
        return;
      }

      headerComplete = true;
      bodyList.push(child);
    });

    if (collapsible && headerList.length === 0 && bodyList.length > 0) {
      headerList.push(bodyList.shift() as ReactNode);
    }

    return { headerElements: headerList, bodyElements: bodyList };
  }, [children, collapsible]);

  const toggleCollapse = () => setCollapsed((prev) => !prev);
  const iconName = collapsed ? "chevron-down" : "chevron-up";

  return (
    <FormCardContext.Provider value={true}>
      <View style={styles.card}>
        {collapsible ? (
          <>
            <View style={styles.headerRow}>
              <View style={styles.headerContent}>{headerElements}</View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={collapsed ? "Развернуть" : "Свернуть"}
                onPress={toggleCollapse}
                style={styles.toggleButton}
              >
                <MaterialCommunityIcons name={iconName} size={18} style={styles.toggleIcon} />
              </Pressable>
            </View>
            {!collapsed && bodyElements.length ? (
              <View style={styles.cardBody}>{bodyElements}</View>
            ) : null}
          </>
        ) : (
          children
        )}
      </View>
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

function isHeaderElement(child: React.ReactNode) {
  if (!isValidElement(child)) return false;
  return child.type === FormCardTitle || child.type === FormCardSubtitle;
}

FormCardTitle.displayName = "FormCardTitle";
FormCardSubtitle.displayName = "FormCardSubtitle";
