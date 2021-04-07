import React, { useState, useContext, createContext } from "react";
import jwtDecode from "jwt-decode";
interface AuthProviderProps {
  children: React.ReactElement;
}
interface AuthContext {
  // eslint-disable-next-line @typescript-eslint/ban-types
  user: Object;
  token: string;
  isConnected: boolean;
  connect: CallableFunction;
  disconnect: CallableFunction;
}

const authContext = createContext(null);

export function AuthProvider({
  children,
}: AuthProviderProps): React.ReactElement {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth(): AuthContext {
  return useContext(authContext);
}

export function useAuthProvider(): AuthContext {
  const [user, setUser] = useState(localStorage.getItem("token"));
  const [token, setToken] = useState(null);

  let isConnected = false;

  try {
    const { exp } = jwtDecode(token) as never;
    isConnected = exp < Date.now();
  } catch (e) {}

  function connect({ user, token }) {
    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
  }

  function disconnect() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  }

  return {
    user,
    token,
    isConnected,
    connect,
    disconnect,
  };
}
