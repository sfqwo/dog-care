export function normalizeAuthEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getAuthErrorMessage(error: unknown) {
  if (!(error instanceof Error)) return "Не удалось выполнить действие";

  const message = error.message.toLowerCase();
  if (message.includes("invalid login credentials")) return "Неверный email или пароль";
  if (message.includes("email not confirmed")) return "Сначала подтвердите email";
  if (message.includes("user already registered")) return "Пользователь с таким email уже существует";
  if (message.includes("password should be")) return "Пароль должен содержать не менее 6 символов";
  if (message.includes("rate limit")) return "Слишком много попыток. Попробуйте позже";
  if (message.includes("network request failed") || message.includes("failed to fetch")) {
    return "Нет соединения с сервером";
  }

  return "Не удалось выполнить действие";
}

export function getAuthCallbackParams(url: string) {
  const parsedUrl = new URL(url);
  const hashParams = new URLSearchParams(parsedUrl.hash.replace(/^#/, ""));

  return {
    accessToken: hashParams.get("access_token"),
    refreshToken: hashParams.get("refresh_token"),
    type: hashParams.get("type") ?? parsedUrl.searchParams.get("type"),
    code: parsedUrl.searchParams.get("code"),
  };
}
