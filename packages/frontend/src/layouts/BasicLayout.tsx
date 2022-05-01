import React from "react";
import { Box, LinearProgress } from "@material-ui/core";
import { Helmet } from "react-helmet";

import { TopBar } from "Components/TopBar";
// import { CustomBottomNavigation } from "Components/BottomNavigation";

interface BasicLayoutProps {
  title: string;
  loading?: boolean;
  error?: any;
  actions?: React.ReactElement;
  children: React.ReactElement | React.ReactElement[];
}

export function BasicLayout({
  title = "Kutub",
  loading = false,
  error,
  actions,
  children,
}: BasicLayoutProps): React.ReactElement {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Box display="flex" flexDirection="column" width="100vw" height="100vh">
        <Box flexBasis={64}>
          <TopBar title={title} actions={actions} />
        </Box>
        <Box>{loading && <LinearProgress />}</Box>
        <Box
          flexBasis="auto"
          height="100%"
          overflow="scroll"
          position="relative"
        >
          {error ? "error" : children}
        </Box>
        {/* <Box flexBasis={56}>
        <CustomBottomNavigation />
      </Box> */}
      </Box>
    </>
  );
}
