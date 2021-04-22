import * as React from "react";
import { useParams } from "react-router-dom";
import {} from "@material-ui/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ReactReaderStyle, EpubViewStyle, EpubView } from "react-reader";

import { EmptyLayout } from "Layouts/EmptyLayout";
import { useQuery } from "@apollo/client";
import { EPUB_BYID_QUERY } from "Graph/queries/epubs";

const styles = {
  ...ReactReaderStyle,
  ...EpubViewStyle,
};

export function ReaderPage(): React.ReactElement {
  const { epubId } = useParams();
  const { loading, error, data } = useQuery(EPUB_BYID_QUERY, {
    variables: { epubId },
  });

  if (loading) return <>Loading...</>;
  if (error) return <>Error! {error.message}</>;

  return (
    <EmptyLayout>
      <EpubView
        url={`http://localhost:4000/${data?.epub?.filePath}`}
        location={"epubcfi(/6/2[cover]!/6)"}
        locationChanged={(epubcifi) => console.log(epubcifi)}
        styles={styles}
        getRendition={(rendition) => {
          // (window as any).rendition = rendition;
          rendition.on("selected", function (cfiRange) {
            rendition.annotations.highlight(cfiRange);
          });
        }}
      />
    </EmptyLayout>
  );
}
