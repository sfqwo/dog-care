import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { AuthButtonProps, AuthLinkProps, AuthScreenProps } from "./types";
import { authScreenStyles } from "./styles";
import { colors } from "@/src/theme";

export function AuthScreen({ title, subtitle, icon, children }: AuthScreenProps) {
  return (
    <SafeAreaView style={authScreenStyles.safeArea}>
      <KeyboardAvoidingView
        style={authScreenStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={authScreenStyles.scrollContent}
        >
          <View style={authScreenStyles.content}>
            <View style={authScreenStyles.brand}>
              <View style={authScreenStyles.iconBox}>
                <MaterialCommunityIcons name={icon} size={27} color={colors.primaryText} />
              </View>
              <Text style={authScreenStyles.brandName}>Dog Care</Text>
              <Text style={authScreenStyles.title}>{title}</Text>
              <Text style={authScreenStyles.subtitle}>{subtitle}</Text>
            </View>
            <View style={authScreenStyles.form}>{children}</View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function AuthButton({ children, onPress, disabled }: AuthButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        authScreenStyles.button,
        pressed && authScreenStyles.buttonPressed,
        disabled && authScreenStyles.buttonDisabled,
      ]}
    >
      <Text style={authScreenStyles.buttonText}>{children}</Text>
    </Pressable>
  );
}

export function AuthLink({ children, href }: AuthLinkProps) {
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link" style={authScreenStyles.link}>
        <Text style={authScreenStyles.linkText}>{children}</Text>
      </Pressable>
    </Link>
  );
}

export { authScreenStyles } from "./styles";
