import * as React from "react";
import {} from "@material-ui/core";
import { ReactReader } from "react-reader";

import { BasicLayout } from "Layouts/BasicLayout";

export function ReaderPage(): React.ReactElement {
  return (
    <BasicLayout>
      <ReactReader
        url={"https://s3.amazonaws.com/epubjs/books/alice.epub"}
        title={"Alice in wonderland"}
        location={"epubcfi(/6/2[cover]!/6)"}
        locationChanged={(epubcifi) => console.log(epubcifi)}
      />
    </BasicLayout>
  );
}
