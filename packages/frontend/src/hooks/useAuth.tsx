import React, { useState, useContext, createContext } from "react";
import { useQuery } from "@apollo/client";
import jwtDecode from "jwt-decode";

import { ME_QUERY } from "Graph/queries/auth";
import { User } from "Types/User";

interface AuthProviderProps {
  children: React.ReactElement;
}

interface AuthContext {
  user: User;
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
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [deviceId, setDeviceId] = useState(localStorage.getItem("device-id"));

  useQuery(ME_QUERY, {
    onCompleted: ({ me }: { me: User}) => {
      setUser(me)
      localStorage.setItem("device-id", me?.currentDevice?.id)
    },
  });

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
