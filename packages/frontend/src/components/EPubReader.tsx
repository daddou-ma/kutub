import React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EpubViewStyle, EpubView } from "react-reader";

export default function EPubReader({
  url,
  location,
  locationChanged,
  styles,
  tocChanged,
  getRendition,
}): React.ReactElement {
  return (
    <EpubView
      url={url}
      location={location}
      locationChanged={locationChanged}
      styles={{
        ...EpubViewStyle,
        ...styles,
      }}
      tocChanged={tocChanged}
      getRendition={getRendition}
    />
  );
}
