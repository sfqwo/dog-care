import { useContext, createContext } from "react";
import { Modal as RNModal, Pressable, Text, View, StyleSheet, ScrollView } from "react-native";
import { styles } from "./styles";
import type {
  ModalActionButtonProps,
  ModalActionsProps,
  ModalContextValue,
  ModalProps,
  ModalTextProps,
} from "./types";

const ModalContext = createContext<ModalContextValue | null>(null);

export function Modal({
  visible,
  onClose,
  children,
  dismissOnBackdropPress = true,
  animationType = "fade",
}: ModalProps) {
  return (
    <RNModal transparent animationType={animationType} visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {dismissOnBackdropPress ? (
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        ) : null}
        <View style={styles.cardWrapper}>
          <ScrollView contentContainerStyle={styles.card} showsVerticalScrollIndicator={false}>
            <ModalContext.Provider value={{ onClose }}>{children}</ModalContext.Provider>
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
}

export function ModalTitle({ children }: ModalTextProps) {
  useModalGuard("ModalTitle");
  return <Text style={styles.title}>{children}</Text>;
}

export function ModalSubtitle({ children }: ModalTextProps) {
  useModalGuard("ModalSubtitle");
  return <Text style={styles.subtitle}>{children}</Text>;
}

export function ModalActions({ children }: ModalActionsProps) {
  useModalGuard("ModalActions");
  return <View style={styles.actions}>{children}</View>;
}

export function ModalActionButton({
  children,
  onPress,
  closeOnPress = false,
  disabled = false,
}: ModalActionButtonProps) {
  const context = useModalGuard("ModalActionButton");
  const handlePress = () => {
    if (disabled) return;
    onPress?.();
    if (closeOnPress) context.onClose();
  };

  return (
    <Pressable
      style={[
        styles.actionButton,
        closeOnPress && styles.actionButtonSecondary,
        disabled && styles.actionButtonDisabled,
      ]}
      onPress={handlePress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.actionText,
          closeOnPress && styles.actionTextSecondary,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

function useModalGuard(componentName: string) {
  const context = useContext(ModalContext);
  if (!context) {
    console.warn(`[Modal] ${componentName} must be used inside <Modal>.`);
    return { onClose: () => {} };
  }
  return context;
}
