import { useState } from "react";
import { Text, View } from "react-native";
import { Input } from "@dog-care/input";
import { router } from "expo-router";
import { AuthButton, AuthLink, AuthScreen, authScreenStyles } from "@/src/components/authScreen";
import { useAuthContext } from "@/src/hooks/authContext";
import { getAuthErrorMessage } from "@/src/hooks/authContext/utils";

export default function SignInScreen() {
  const { signIn } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = email.trim().length > 0 && password.length > 0 && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError("");
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      router.replace("/walks");
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreen title="Вход" subtitle="Откройте журналы и расписание вашего питомца." icon="paw">
      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Пароль"
        secureTextEntry
        textContentType="password"
        onSubmitEditing={handleSubmit}
      />
      {error ? <Text style={authScreenStyles.error}>{error}</Text> : null}
      <AuthButton onPress={handleSubmit} disabled={!canSubmit}>
        {isSubmitting ? "Входим..." : "Войти"}
      </AuthButton>
      <AuthLink href="/forgot-password">Забыли пароль?</AuthLink>
      <View style={authScreenStyles.row}>
        <Text style={authScreenStyles.secondaryText}>Нет аккаунта?</Text>
        <AuthLink href="/sign-up">Зарегистрироваться</AuthLink>
      </View>
    </AuthScreen>
  );
}
