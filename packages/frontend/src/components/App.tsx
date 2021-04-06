import * as React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";
import QuoteList from "./QuoteList";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
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
      <>
        Quote List
        <QuoteList />
      </>
    </ApolloProvider>
  );
}
