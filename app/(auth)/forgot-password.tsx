import { useState } from "react";
import { Text } from "react-native";
import { Input } from "@dog-care/input";
import { AuthButton, AuthLink, AuthScreen, authScreenStyles } from "@/src/components/authScreen";
import { useAuthContext } from "@/src/hooks/authContext";
import { getAuthErrorMessage } from "@/src/hooks/authContext/utils";

export default function ForgotPasswordScreen() {
  const { sendPasswordReset } = useAuthContext();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = email.trim().length > 0 && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError("");
    setIsSubmitting(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreen
      title="Восстановление"
      subtitle="Отправим ссылку для создания нового пароля."
      icon="lock-reset"
    >
      <Input
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setSent(false);
        }}
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
        onSubmitEditing={handleSubmit}
      />
      {sent ? (
        <Text style={authScreenStyles.success}>Ссылка отправлена. Проверьте почту.</Text>
      ) : null}
      {error ? <Text style={authScreenStyles.error}>{error}</Text> : null}
      <AuthButton onPress={handleSubmit} disabled={!canSubmit}>
        {isSubmitting ? "Отправляем..." : "Отправить ссылку"}
      </AuthButton>
      <AuthLink href="/sign-in">Вернуться ко входу</AuthLink>
    </AuthScreen>
  );
}
