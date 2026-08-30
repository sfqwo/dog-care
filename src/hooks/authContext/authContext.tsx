import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Linking } from "react-native";
import * as ExpoLinking from "expo-linking";
import { router } from "expo-router";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/src/shared/api/supabase";
import type { AuthContextValue, AuthProviderProps } from "./types";
import { getAuthCallbackParams, normalizeAuthEmail } from "./utils";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) console.warn("Failed to restore Supabase session", error);
      setSession(data.session);
      setIsAuthLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setIsAuthLoading(false);
      if (event === "PASSWORD_RECOVERY") router.replace("/reset-password");
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleUrl = async (url: string | null) => {
      if (!url) return;
      let callbackParams: ReturnType<typeof getAuthCallbackParams>;
      try {
        callbackParams = getAuthCallbackParams(url);
      } catch {
        return;
      }
      const { accessToken, refreshToken, code, type } = callbackParams;

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) console.warn("Failed to exchange Supabase auth code", error);
      } else if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) console.warn("Failed to restore Supabase auth callback", error);
      } else {
        return;
      }

      if (type === "recovery" || url.includes("reset-password")) {
        router.replace("/reset-password");
      }
    };

    void Linking.getInitialURL().then(handleUrl);
    const subscription = Linking.addEventListener("url", ({ url }) => void handleUrl(url));
    return () => subscription.remove();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: normalizeAuthEmail(email),
      password,
    });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (ownerName: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: normalizeAuthEmail(email),
      password,
      options: {
        data: { owner_name: ownerName.trim() },
        emailRedirectTo: ExpoLinking.createURL("/"),
      },
    });
    if (error) throw error;
    return { emailConfirmationRequired: !data.session };
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(normalizeAuthEmail(email), {
      redirectTo: ExpoLinking.createURL("/reset-password"),
    });
    if (error) throw error;
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    isAuthLoading,
    signIn,
    signUp,
    sendPasswordReset,
    updatePassword,
    signOut,
  }), [isAuthLoading, sendPasswordReset, session, signIn, signOut, signUp, updatePassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider.");
  return context;
}
