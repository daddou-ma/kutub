import * as React from "react";
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
  redirect: string;
  children: React.ReactElement;
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
        <Route path={path}>{children}</Route>
      ) : (
        <Redirect to={redirect} />
      )}
    </>
  );
}
