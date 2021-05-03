import React, { useState, useEffect } from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { relayStylePagination } from "@apollo/client/utilities";
import { persistCache, LocalStorageWrapper } from "apollo3-cache-persist";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { create } from "jss";
import rtl from "jss-rtl";
import { StylesProvider, jssPreset } from "@material-ui/core/styles";
import { ThemeProvider } from "Hooks/useTheme";

import { QuotePage } from "Pages/Quotes";
import { LibraryPage } from "Pages/Library";
import { FavoriteQuotePage } from "Pages/FavoriteQuotes";
import { ReaderPage } from "Pages/Reader";
import { LoginPage } from "Pages/Login";
import { SettingsPage } from "Pages/Settings";
import { LanguageSettingsPage } from "Pages/LanguageSettings";
import { CustomRoute, Role } from "Components/CustomRoute";
import { AuthProvider } from "Hooks/useAuth";
import { SnackbarProvider } from "Hooks/useSnackbar";

const GRAPH_URL = process.env.GRAPHQL_URL;

const httpLink = createUploadLink({
  uri: GRAPH_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

export function App(): React.ReactElement {
  const [client, setClient] = useState(null);
  useEffect(() => {
    async function init() {
      const cache = new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              quotes: relayStylePagination(),
              epubs: relayStylePagination(),
              books: relayStylePagination(),
            },
          },
        },
      });

      await persistCache({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
      });

      const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache,
        defaultOptions: {
          watchQuery: {
            fetchPolicy: "cache-and-network",
          },
          query: {
            fetchPolicy: "cache-first",
            errorPolicy: "all",
          },
        },
      });

      setClient(client);
    }

    init().catch(console.error);
  }, []);

  if (!client) {
    return <h2>Loading Cache...</h2>;
  }

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <StylesProvider jss={jss}>
          <ThemeProvider>
            <SnackbarProvider>
              <Router>
                <Switch>
                  <CustomRoute
                    path="/library"
                    role={Role.USER}
                    redirect="login"
                  >
                    <LibraryPage />
                  </CustomRoute>
                  <CustomRoute path="/login" role={Role.GUEST} redirect="/">
                    <LoginPage />
                  </CustomRoute>
                  <CustomRoute
                    path="/quotes"
                    role={Role.USER}
                    redirect="/login"
                  >
                    <QuotePage />
                  </CustomRoute>
                  <CustomRoute
                    path="/favorites"
                    role={Role.USER}
                    redirect="/login"
                  >
                    <FavoriteQuotePage />
                  </CustomRoute>
                  <CustomRoute
                    path="/reader/:epubId"
                    role={Role.USER}
                    redirect="/login"
                  >
                    <ReaderPage />
                  </CustomRoute>
                  <CustomRoute
                    path="/settings/language"
                    role={Role.USER}
                    redirect="/login"
                  >
                    <LanguageSettingsPage />
                  </CustomRoute>
                  <CustomRoute
                    path="/settings"
                    role={Role.USER}
                    redirect="/login"
                  >
                    <SettingsPage />
                  </CustomRoute>
                  <CustomRoute path="/" role={Role.USER} redirect="/login">
                    <LibraryPage />
                  </CustomRoute>
                </Switch>
              </Router>
            </SnackbarProvider>
          </ThemeProvider>
        </StylesProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
