import * as React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import QuoteList from "./QuoteList";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
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
