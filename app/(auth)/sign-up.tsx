import { useState } from "react";
import { Text, View } from "react-native";
import { Input } from "@dog-care/input";
import { router } from "expo-router";
import { AuthButton, AuthLink, AuthScreen, authScreenStyles } from "@/src/components/authScreen";
import { useAuthContext } from "@/src/hooks/authContext";
import { getAuthErrorMessage } from "@/src/hooks/authContext/utils";
import { useInformer } from "@/src/components/informer";

export default function SignUpScreen() {
  const { signUp } = useAuthContext();
  const { showInformer, showSuccess } = useInformer();
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = Boolean(
    ownerName.trim() &&
      email.trim() &&
      password.length >= 6 &&
      password === passwordConfirmation &&
      !isSubmitting
  );

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError("");
    setIsSubmitting(true);
    try {
      const result = await signUp(ownerName, email, password);
      if (result.emailConfirmationRequired) {
        showInformer("Проверьте почту и подтвердите регистрацию", "info");
        router.replace("/sign-in");
      } else {
        showSuccess("Аккаунт создан");
        router.replace("/walks");
      }
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordMismatch = passwordConfirmation.length > 0 && password !== passwordConfirmation;

  return (
    <AuthScreen
      title="Регистрация"
      subtitle="Создайте аккаунт, чтобы хранить данные питомца в одном месте."
      icon="account-plus-outline"
    >
      <Input
        value={ownerName}
        onChangeText={setOwnerName}
        placeholder="Ваше имя"
        autoCapitalize="words"
        textContentType="name"
      />
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
        placeholder="Пароль, минимум 6 символов"
        secureTextEntry
        textContentType="newPassword"
      />
      <Input
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        placeholder="Повторите пароль"
        secureTextEntry
        textContentType="newPassword"
        onSubmitEditing={handleSubmit}
      />
      {passwordMismatch ? (
        <Text style={authScreenStyles.error}>Пароли не совпадают</Text>
      ) : null}
      {error ? <Text style={authScreenStyles.error}>{error}</Text> : null}
      <AuthButton onPress={handleSubmit} disabled={!canSubmit}>
        {isSubmitting ? "Создаём аккаунт..." : "Создать аккаунт"}
      </AuthButton>
      <View style={authScreenStyles.row}>
        <Text style={authScreenStyles.secondaryText}>Уже есть аккаунт?</Text>
        <AuthLink href="/sign-in">Войти</AuthLink>
      </View>
    </AuthScreen>
  );
}
