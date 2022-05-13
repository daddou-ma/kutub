import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { useTheme } from "@material-ui/core";

import { ReaderLayout } from "Layouts/ReaderLayout";
import { LECTURE_BYID_QUERY, UPDATE_LECTURE_MUTATION } from "Graph/queries/lectures";
import { loadFileFromCache } from "Utils/File";

const EPubReader = React.lazy(() => import("Components/EPubReader"));

const styles = {};

export default function ReaderPage(): React.ReactElement {
  const [rendition, setRendition] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [location, setLocation] = useState(null);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null)
  const { lectureId } = useParams();
  const theme = useTheme();
  const { loading, error, data } = useQuery(LECTURE_BYID_QUERY, {
    nextFetchPolicy: "cache-first",
    variables: { lectureId },
    onCompleted({ lecture }) {
      setLocation(lecture.location);
      setProgress(lecture.progress);
    },
  });

  const [updateEPub] = useMutation(UPDATE_LECTURE_MUTATION);

  useEffect(() => {
    async function loadFunction() {
      setFile(await loadFileFromCache('cached-epubs', data?.lecture?.filePath))
    }
    loadFunction()
  }, [data?.lecture?.filePath])

  return (
    <ReaderLayout
      title={data?.lecture?.book?.title}
      loading={loading}
      error={!data && error}
      progress={progress}
      chapters={chapters}
      handleChapterClick={setLocation}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <EPubReader
          url={file}
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
                lectureId,
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
      </Suspense>
    </ReaderLayout>
  );
}
