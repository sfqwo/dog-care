import { Redirect } from "expo-router";
import { useAuthContext } from "@/src/hooks/authContext";

export default function Index() {
  const { session } = useAuthContext();
  return <Redirect href={session ? "/walks" : "/sign-in"} />;
}
