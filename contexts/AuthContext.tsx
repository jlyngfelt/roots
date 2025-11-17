import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "firebase/auth";
import { onAuthChange } from "../auth";
import { useRouter, useSegments } from "expo-router";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser: User | null) => {
      if (firebaseUser) {
        await firebaseUser.reload();
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
      
      if (!initialCheckDone) {
        setInitialCheckDone(true);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading || !initialCheckDone) return;

    const inRegister = segments.some((segment) => segment === "register");
    const inWelcome = segments[0] === "welcome";
    const inLogin = segments[0] === "login";
    const inTabs = segments[0] === "(tabs)";

    if (!user && inTabs) {
      router.replace("/welcome");
    }

    if (user) {
      if (!user.emailVerified) {
        if (!inRegister) {
          router.replace({
            pathname: "/register",
            params: { fromLogin: "true", email: user.email || "" }
          });
        }
      } else {
        if (inWelcome || inLogin) {
          router.replace("/(tabs)/explore");
        }
      }
    }
  }, [user, loading, segments, initialCheckDone]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);