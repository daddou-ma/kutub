import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "Hooks/useAuth";

export enum Role {
  GUEST = "guest",
  USER = "user",
  ANY = "any",
}

interface CustomRouteProps {
  path: string;
  role: Role;
  redirect: string | undefined;
  children: any;
}

export function CustomRoute({
  path,
  role,
  redirect,
  children,
}: CustomRouteProps): React.ReactElement {
  const { isConnected } = useAuth();
  const allowed =
    (isConnected && role === Role.USER) ||
    (!isConnected && role === Role.GUEST) ||
    role === Role.ANY;

  return (
    <>
      {allowed ? (
        <Route exact path={path} key={Math.random()}>
          {children}
        </Route>
      ) : (
        <Redirect to={redirect} />
      )}
    </>
  );
}
