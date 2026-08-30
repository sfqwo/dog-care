import { useState } from "react";
import { Text } from "react-native";
import { Input } from "@dog-care/input";
import { router } from "expo-router";
import { AuthButton, AuthScreen, authScreenStyles } from "@/src/components/authScreen";
import { useAuthContext } from "@/src/hooks/authContext";
import { getAuthErrorMessage } from "@/src/hooks/authContext/utils";
import { useInformer } from "@/src/components/informer";

export default function ResetPasswordScreen() {
  const { updatePassword } = useAuthContext();
  const { showSuccess } = useInformer();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = password.length >= 6 && password === passwordConfirmation && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError("");
    setIsSubmitting(true);
    try {
      await updatePassword(password);
      showSuccess("Пароль обновлён");
      router.replace("/walks");
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordMismatch = passwordConfirmation.length > 0 && password !== passwordConfirmation;

  return (
    <AuthScreen
      title="Новый пароль"
      subtitle="Укажите новый пароль для вашего аккаунта."
      icon="shield-key-outline"
    >
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Новый пароль, минимум 6 символов"
        secureTextEntry
        textContentType="newPassword"
      />
      <Input
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        placeholder="Повторите новый пароль"
        secureTextEntry
        textContentType="newPassword"
        onSubmitEditing={handleSubmit}
      />
      {passwordMismatch ? (
        <Text style={authScreenStyles.error}>Пароли не совпадают</Text>
      ) : null}
      {error ? <Text style={authScreenStyles.error}>{error}</Text> : null}
      <AuthButton onPress={handleSubmit} disabled={!canSubmit}>
        {isSubmitting ? "Сохраняем..." : "Сохранить пароль"}
      </AuthButton>
    </AuthScreen>
  );
}
