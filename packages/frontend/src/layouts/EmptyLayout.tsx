import React from "react";
import { Box } from "@material-ui/core";

interface EmptyLayoutProps {
  children: React.ReactElement;
}

export function EmptyLayout({
  children,
}: EmptyLayoutProps): React.ReactElement {
  return (
    <Box display="flex" flexDirection="column" width="100vw" height="100vh">
      <Box flexBasis="auto" height="100%" overflow="scroll">
        {children}
      </Box>
    </Box>
  );
}
