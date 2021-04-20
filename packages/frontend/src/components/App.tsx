import React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { relayStylePagination } from "@apollo/client/utilities";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { create } from "jss";
import rtl from "jss-rtl";
import {
  MuiThemeProvider,
  StylesProvider,
  createMuiTheme,
  jssPreset,
} from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

import { QuotePage } from "Pages/Quotes";
import { LibraryPage } from "Pages/Library";
import { FavoriteQuotePage } from "Pages/FavoriteQuotes";
import { ReaderPage } from "Pages/Reader";
import { LoginPage } from "Pages/Login";
import { CustomRoute, Role } from "Components/CustomRoute";
import { AuthProvider } from "Hooks/useAuth";

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
  const { i18n } = useTranslation();
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <StylesProvider jss={jss}>
          <MuiThemeProvider
            theme={createMuiTheme({
              direction: i18n.dir(),
            })}
          >
            <Router>
              <Switch>
                <CustomRoute path="/library" role={Role.USER} redirect="login">
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
                <CustomRoute path="/" role={Role.USER} redirect="login">
                  <QuotePage />
                </CustomRoute>
              </Switch>
            </Router>
          </MuiThemeProvider>
        </StylesProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
