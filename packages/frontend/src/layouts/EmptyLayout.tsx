import React from "react";
import { Box } from "@material-ui/core";
import { Helmet } from "react-helmet";

interface EmptyLayoutProps {
  title: string;
  children: React.ReactElement;
}

export function EmptyLayout({
  title = "Kutub",
  children,
}: EmptyLayoutProps): React.ReactElement {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Box display="flex" flexDirection="column" width="100vw" height="100vh">
        <Box flexBasis="auto" height="100%" overflow="scroll">
          {children}
        </Box>
      </Box>
    </>
  );
}
