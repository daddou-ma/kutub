import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { useTheme } from "@material-ui/core";

import { ReaderLayout } from "Layouts/ReaderLayout";
import { LECTURE_BYID_QUERY, UPDATE_LECTURE_MUTATION } from "Graph/queries/lectures";
import { loadFileFromCache } from "Utils/File";
import { useReaderSettings } from "Hooks/useReaderSettings";

const EPubReader = React.lazy(() => import("Components/EPubReader"));

const styles = {};

export default function ReaderPage(): React.ReactElement {
  const [rendition, setRendition] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [location, setLocation] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showOptions, setShowOptions] = useState(false); 
  const [file, setFile] = useState(null)
  const { lectureId } = useParams();
  const theme = useTheme();
  const { theme: readerTheme } = useReaderSettings()
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
    if (!data?.lecture?.filePath) {
      return
    }

    let isSubscribed = true;
    async function loadFunction() {
      const file = await loadFileFromCache('cached-epubs', data?.lecture?.filePath)
      if (isSubscribed) {
        setFile(file)
      }
    }
    loadFunction()
    return () => (isSubscribed = false);
  }, [data?.lecture?.filePath])

  return (
    <ReaderLayout
      title={data?.lecture?.book?.title}
      loading={loading}
      error={!data && error}
      progress={progress}
      chapters={chapters}
      currentChapter={currentChapter}
      handleChapterClick={setLocation}
      showOptions={showOptions}
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

              let getChapter = cfi => {
                let spineItem = rendition.book.spine.get(cfi);
                return rendition.book.navigation.get(spineItem.href).label;
              }  

              setCurrentChapter(getChapter(location))

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
            theme={readerTheme}
            styles={styles}
            tocChanged={(cs) => setChapters(cs as any)}
            getRendition={(rendition) => {
              setRendition(rendition);
              rendition.book.locations.generate(undefined);

              rendition.themes.default({
                body: {
                  color: theme.palette.text.primary,
                  'font-size': '24px'
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
            onTap={() => setShowOptions(!showOptions)}
          />
      </Suspense>
    </ReaderLayout>
  );
}
