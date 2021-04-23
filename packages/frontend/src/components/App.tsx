import React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { relayStylePagination } from "@apollo/client/utilities";
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

const GRAPH_URL = "http://localhost:4000/graphql";

const httpLink = createUploadLink({
  uri: GRAPH_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  console.log("token", token);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          quotes: relayStylePagination(),
          epubs: relayStylePagination(),
          books: relayStylePagination(),
        },
      },
    },
  }),
});

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

export function App(): React.ReactElement {
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
                  <CustomRoute path="/quotes" role={Role.USER} redirect="login">
                    <QuotePage />
                  </CustomRoute>
                  <CustomRoute
                    path="/favorites"
                    role={Role.USER}
                    redirect="login"
                  >
                    <FavoriteQuotePage />
                  </CustomRoute>
                  <CustomRoute
                    path="/reader/:epubId"
                    role={Role.USER}
                    redirect="login"
                  >
                    <ReaderPage />
                  </CustomRoute>
                  <CustomRoute
                    path="/settings/language"
                    role={Role.USER}
                    redirect="login"
                  >
                    <LanguageSettingsPage />
                  </CustomRoute>
                  <CustomRoute
                    path="/settings"
                    role={Role.USER}
                    redirect="login"
                  >
                    <SettingsPage />
                  </CustomRoute>
                  <CustomRoute path="/" role={Role.USER} redirect="login">
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
