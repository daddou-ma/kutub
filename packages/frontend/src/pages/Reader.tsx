import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@material-ui/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EpubViewStyle, EpubView } from "react-reader";

import { ReaderLayout } from "Layouts/ReaderLayout";
import { useQuery } from "@apollo/client";
import { EPUB_BYID_QUERY } from "Graph/queries/epubs";

const styles = {
  ...EpubViewStyle,
};

export function ReaderPage(): React.ReactElement {
  const [rendition, setRendition] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [location, setLocation] = useState(null);
  const [progress, setProgress] = useState(0);

  const { epubId } = useParams();
  const theme = useTheme();
  const { loading, error, data } = useQuery(EPUB_BYID_QUERY, {
    variables: { epubId },
  });

  if (loading) return <>Loading...</>;
  if (error) return <>Error! {error.message}</>;

  return (
    <ReaderLayout
      title={data?.epub?.book?.title}
      progress={progress}
      chapters={chapters}
      handleChapterClick={setLocation}
    >
      <EpubView
        url={`http://localhost:4000/${data?.epub?.filePath}`}
        location={location}
        locationChanged={(epubcifi) => {
          setLocation(epubcifi);
          console.log(epubcifi);

          if (!rendition) {
            return;
          }
          const progress = rendition.book.locations.percentageFromCfi(epubcifi);

          console.log("sds", progress);
          setProgress(progress);
        }}
        styles={styles}
        tocChanged={(cs) => setChapters(cs)}
        getRendition={(rendition) => {
          setRendition(rendition);
          rendition.book.locations.generate();

          rendition.themes.default({
            body: {
              color: theme.palette.text.primary,
            },
            a: {
              color: theme.palette.text.secondary,
            },
          });
          (window as any).rendition = rendition;
          rendition.on("selected", function (cfiRange) {
            rendition.annotations.highlight(cfiRange);
          });
        }}
      />
    </ReaderLayout>
  );
}
