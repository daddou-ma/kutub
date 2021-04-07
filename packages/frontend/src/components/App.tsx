import * as React from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { relayStylePagination } from "@apollo/client/utilities";
import QuoteList from "./QuoteList";
import { LoginPage } from "./pages/Login";
import { AuthProvider } from "../hooks/useAuth";

const GRAPH_URL = "http://localhost:4000/graphql";

const httpLink = createHttpLink({
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
        },
      },
    },
  }),
});

export function App(): React.ReactElement {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <>
          Quote List
          <LoginPage />
          <QuoteList />
        </>
      </AuthProvider>
    </ApolloProvider>
  );
}
