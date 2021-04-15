import * as React from "react";
import { Box } from "@material-ui/core";

import { TopBar } from "Components/TopBar";
import { CustomBottomNavigation } from "Components/BottomNavigation";

interface BasicLayoutProps {
  children: React.ReactElement;
}

export function BasicLayout({
  children,
}: BasicLayoutProps): React.ReactElement {
  return (
    <Box display="flex" flexDirection="column" width="100vw" height="100vh">
      <Box flexBasis={64}>
        <TopBar />
      </Box>
      <Box flexBasis="auto" height="100%" overflow="scroll" position="relative">
        {children}
      </Box>
      <Box flexBasis={56}>
        <CustomBottomNavigation />
      </Box>
    </Box>
  );
}
