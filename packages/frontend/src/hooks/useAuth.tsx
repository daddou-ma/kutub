import React, { useState, useContext, createContext } from "react";
import { useQuery } from "@apollo/client";
import jwtDecode from "jwt-decode";

import { ME_QUERY } from "Graph/queries/auth";

interface AuthProviderProps {
  children: React.ReactElement;
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

interface AuthContext {
  // eslint-disable-next-line @typescript-eslint/ban-types
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

  useQuery(ME_QUERY, {
    onCompleted: ({ me }) => setUser(me),
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