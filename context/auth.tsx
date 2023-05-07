import { useRouter, useSegments } from "expo-router";
import { useEffect, useContext, createContext, useState } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function useProtectedRoute(user) {
  const rootSegment = useSegments()[0];
  const router = useRouter();
  useEffect(() => {
    console.log(rootSegment, user);
    // if (user === undefined) {
    //   return
    // }
    if (!user && rootSegment !== "(auth)") {
      router.replace("/(auth)/sign-in");
    } else if (user && rootSegment !== "(tabs)") {
      // Redirect away from the sign-in page.
      router.replace("/");
    }
  }, [user, rootSegment]);
}

export function Provider(props) {
  const { getItem, setItem, removeItem } = useAsyncStorage("USER");
  const [user, setAuth] = useState(undefined);

  useEffect(() => {
    getItem().then(json => {
      console.log(json)
      if (json != null) {
        setAuth(JSON.parse(json))
      } else {
        setAuth(null)
      }
    })
  }, [])

  // useProtectedRoute(user)

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          setAuth({});
          setItem(JSON.stringify({}));
        },
        signOut: () => {
          setAuth(null);
          removeItem();
        },
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
