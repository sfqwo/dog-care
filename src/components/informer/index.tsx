import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type {
  InformerContextValue,
  InformerProviderProps,
  InformerVariant,
} from "./types";
import { informerStyles } from "./styles";
import { getInformerIcon } from "./utils";

const InformerContext = createContext<InformerContextValue | null>(null);

export function InformerProvider({ children }: InformerProviderProps) {
  const [current, setCurrent] = useState<{ message: string; variant: InformerVariant } | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 8, duration: 180, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) setCurrent(null);
    });
  }, [opacity, translateY]);

  const showInformer = useCallback<InformerContextValue["showInformer"]>((message, variant = "success") => {
    if (timerRef.current) clearTimeout(timerRef.current);
    opacity.stopAnimation();
    translateY.stopAnimation();
    opacity.setValue(0);
    translateY.setValue(12);
    setCurrent({ message, variant });
    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
      ]).start();
    });
    timerRef.current = setTimeout(hide, 2400);
  }, [hide, opacity, translateY]);

  const value = useMemo<InformerContextValue>(() => ({
    showInformer,
    showSuccess: (message) => showInformer(message, "success"),
  }), [showInformer]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return (
    <InformerContext.Provider value={value}>
      <View style={informerStyles.root}>
        {children}
        {current ? (
          <Animated.View
            accessibilityLiveRegion="polite"
            style={[
              informerStyles.informer,
              current.variant === "info" && informerStyles.informerInfo,
              current.variant === "error" && informerStyles.informerError,
              informerStyles.nonInteractive,
              { opacity, transform: [{ translateY }] },
            ]}
          >
            <MaterialCommunityIcons
              name={getInformerIcon(current.variant)}
              size={21}
              style={informerStyles.icon}
            />
            <Text style={informerStyles.text}>{current.message}</Text>
          </Animated.View>
        ) : null}
      </View>
    </InformerContext.Provider>
  );
}

export function useInformer() {
  const context = useContext(InformerContext);
  if (!context) throw new Error("useInformer must be used within InformerProvider.");
  return context;
}

export type { InformerVariant } from "./types";
