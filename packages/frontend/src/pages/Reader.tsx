import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { useTheme } from "@material-ui/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EpubViewStyle, EpubView } from "react-reader";

import { ReaderLayout } from "Layouts/ReaderLayout";
import { EPUB_BYID_QUERY, UPDATE_EPUB_MUTATION } from "Graph/queries/epubs";

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
    onCompleted({ epub }) {
      setLocation(epub.location);
      setProgress(epub.progress);
    },
  });

  const [updateEPub] = useMutation(UPDATE_EPUB_MUTATION);

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
        url={`${process.env.URL}/${data?.epub?.filePath}`}
        location={rendition ? location : null}
        locationChanged={(location) => {
          setLocation(location);

          if (!rendition) {
            return;
          }

          const progress = Math.ceil(
            rendition.book.locations.percentageFromCfi(location) * 100
          );

          setProgress(progress);

          updateEPub({
            variables: {
              epubId,
              data: {
                location,
                progress,
              },
            },
          });
        }}
        styles={styles}
        tocChanged={(cs) => setChapters(cs as any)}
        getRendition={(rendition) => {
          setRendition(rendition);
          rendition.book.locations.generate(undefined);

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
