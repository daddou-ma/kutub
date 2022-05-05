import React, { useState, useEffect } from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { relayStylePagination } from "@apollo/client/utilities";
import { persistCache, LocalStorageWrapper } from "apollo3-cache-persist";
import { BrowserRouter as Router } from "react-router-dom";
import { create } from "jss";
import rtl from "jss-rtl";
import { StylesProvider, jssPreset } from "@material-ui/core/styles";
import { ThemeProvider } from "Hooks/useTheme";

import { AuthProvider } from "Hooks/useAuth";
import { SnackbarProvider } from "Hooks/useSnackbar";
import { Routes } from "Components/Routes";
import { LoadingPage } from "Pages/Loading";

const GRAPH_PATH = process.env.GRAPHQL_URL;

const parseHeaders = (rawHeaders: any) => {
  const headers = new Headers();
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
  preProcessedHeaders.split(/\r?\n/).forEach((line: any) => {
    const parts = line.split(":");
    const key = parts.shift().trim();
    if (key) {
      const value = parts.join(":").trim();
      headers.append(key, value);
    }
  });
  return headers;
};
export const uploadFetch = (url: string, options: any) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const opts: any = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || ""),
      };
      opts.url =
        "responseURL" in xhr
          ? xhr.responseURL
          : opts.headers.get("X-Request-URL");
      const body = "response" in xhr ? xhr.response : (xhr as any).responseText;
      resolve(new Response(body, opts));
    };
    xhr.onerror = () => {
      reject(new TypeError("Network request failed"));
    };
    xhr.ontimeout = () => {
      reject(new TypeError("Network request failed"));
    };
    xhr.open(options.method, url, true);

    Object.keys(options.headers).forEach((key) => {
      xhr.setRequestHeader(key, options.headers[key]);
    });

    if (xhr.upload) {
      xhr.upload.onprogress = options.onProgress;
    }

    if (options.onAbortPossible) {
      options.onAbortPossible(() => {
        xhr.abort();
      });
    }

    xhr.send(options.body);
  });

const customFetch = (uri: any, options: any) => {
  if (options.useUpload) {
    return uploadFetch(uri, options);
  }
  return fetch(uri, options);
};

const httpLink = createUploadLink({
  uri: GRAPH_PATH,
  fetch: customFetch as any,
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
    return <LoadingPage />;
  }

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <StylesProvider jss={jss}>
          <ThemeProvider>
            <SnackbarProvider>
              <Router>
                <Routes />
              </Router>
            </SnackbarProvider>
          </ThemeProvider>
        </StylesProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
