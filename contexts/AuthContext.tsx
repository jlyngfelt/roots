import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "firebase/auth";
import { onAuthChange } from "../auth";
import { useRouter, useSegments, usePathname } from "expo-router";

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
  const [hasNavigatedFromIndex, setHasNavigatedFromIndex] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser: User | null) => {
      if (firebaseUser) {
        await firebaseUser.reload();
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // KRITISKT: Vänta tills vi har lämnat index-skärmen
    if (pathname === "/" || pathname === "/index") {
      // Vi är på index, gör INGENTING
      return;
    }

    // När vi väl lämnat index, markera att vi har navigerat
    if (!hasNavigatedFromIndex) {
      setHasNavigatedFromIndex(true);
    }

    // Vänta tills loading är klar OCH vi har lämnat index
    if (loading || !hasNavigatedFromIndex) return;

    const inRegister = segments.some((segment) => segment === "register");
    const inWelcome = segments[0] === "welcome";
    const inLogin = segments[0] === "login";
    const inTabs = segments[0] === "(tabs)";

    // Hantera utloggning från tabs
    if (!user && inTabs) {
      router.replace("/welcome");
      return;
    }

    // Hantera inloggade användare
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
  }, [user, loading, segments, pathname, hasNavigatedFromIndex]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);