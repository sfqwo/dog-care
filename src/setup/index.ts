import { canUseExpoNotifications } from "@/src/shared/runtime/expoEnvironment";

if (canUseExpoNotifications()) {
  void import("./notifications");
}

export * from './gestureHandler';
export * from './reanimated';
