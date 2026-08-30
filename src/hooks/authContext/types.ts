import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

export type SignUpResult = {
  emailConfirmationRequired: boolean;
};

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isAuthLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (ownerName: string, email: string, password: string) => Promise<SignUpResult>;
  sendPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export type AuthProviderProps = {
  children: ReactNode;
};
