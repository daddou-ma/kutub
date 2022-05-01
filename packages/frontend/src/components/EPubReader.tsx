import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EpubViewStyle, EpubView } from "react-reader";

const Swipeable = ({ children, ...props }) => {
  const handlers = useSwipeable(props);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
      {...handlers}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: 9,
          touchAction: "pan-y",
        }}
      />
      {children}
    </div>
  );
};

export default function EPubReader({
  url,
  location,
  locationChanged,
  styles,
  tocChanged,
  getRendition,
}): React.ReactElement {
  const [rendition, setRendition] = useState(null);

  function handleGetRendition(rendition) {
    setRendition(rendition);
    getRendition(rendition);
  }
  return (
    <Swipeable
      onSwipedRight={() => rendition.prev()}
      onSwipedLeft={() => rendition.next()}
      trackMouse
    >
      <EpubView
        url={url}
        location={location}
        locationChanged={locationChanged}
        styles={{
          ...EpubViewStyle,
          ...styles,
        }}
        tocChanged={tocChanged}
        getRendition={handleGetRendition}
      />
    </Swipeable>
  );
}
