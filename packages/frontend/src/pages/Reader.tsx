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
console.log(styles);

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
        // title={data?.epub?.filename}
        location={"epubcfi(/6/2[cover]!/6)"}
        locationChanged={(epubcifi) => console.log(epubcifi)}
        styles={styles}
        getRendition={(rendition) => {
          // rendition.annotations.highlight(
          //   "epubcfi(/6/8[x9780062457738-2]!/4[x9780062457738-2]/2[_idContainer005],/6/2/1:0,/14/1:720)"
          // );
          rendition.on("selected", function (cfiRange) {
            (window as any).rendition = rendition;
            (window as any).cfiRange = cfiRange;
            // console.log(cfiRange, rendition);
            // rendition.display(cfiRange);
            // rendition.annotations.mark(cfiRange);
            rendition.annotations.highlight(cfiRange);
            // const range = rendition.book.getRange(cfiRange);
            // let text;
            // const li = document.createElement("li");
            // const a = document.createElement("a");
            // const remove = document.createElement("a");
            // let textNode;

            // if (range) {
            //   text = range.toString();
            //   textNode = document.createTextNode(text);

            //   a.textContent = cfiRange;
            //   a.href = "#" + cfiRange;
            //   a.onclick = function () {
            //     rendition.display(cfiRange);
            //   };

            //   remove.textContent = "remove";
            //   remove.href = "#" + cfiRange;
            //   remove.onclick = function () {
            //     rendition.annotations.remove(cfiRange);
            //     return false;
            //   };

            //   li.appendChild(a);
            //   li.appendChild(textNode);
            //   li.appendChild(remove);
            //   highlights.appendChild(li);
            // }
          });
        }}
      />
    </EmptyLayout>
  );
}
