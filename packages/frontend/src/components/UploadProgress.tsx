import React from "react";
import { Box, LinearProgress, Typography } from "@material-ui/core";

interface UploadProgressProps {
  filename: string;
  progress: number;
}

export function UploadProgress({
  filename,
  progress = 0,
}: UploadProgressProps): React.ReactElement {
  return (
    <Box p={4} textAlign="center">
      <Typography variant="overline">
        {`Uploading ${filename.slice(0, 24)}`}
      </Typography>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
}
