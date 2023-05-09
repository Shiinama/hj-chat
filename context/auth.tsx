import { useRouter, useSegments } from "expo-router";
import { useEffect, useContext, createContext, useState } from "react";
import useUserStore from "../store/userStore";
const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function useProtectedRoute(user) {
  const rootSegment = useSegments()[0];
  const router = useRouter();
  useEffect(() => {
    if (user === undefined) {
      return;
    }
    if (!user && rootSegment !== "(auth)/sign-in") {
      router.replace("(auth)/sign-in");
    }
  }, [user, rootSegment]);
}

export function Provider(props) {
  const router = useRouter();
  const [user, setAuth] = useState(undefined);
  useEffect(() => {
    const userInfo = useUserStore.getState()?.userBaseInfo;
    if (userInfo != null) {
      setAuth(userInfo);
    } else {
      setAuth(null);
    }
  }, []);

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (value) => {
          setAuth(value);
          useUserStore.setState({ userBaseInfo: value });
          router.replace("(tabs)");
        },
        signOut: () => {
          setAuth(null);
          useUserStore.setState({ userBaseInfo: null });
        },
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
