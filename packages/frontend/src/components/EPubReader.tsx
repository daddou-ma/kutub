import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EpubViewStyle, EpubView } from "react-reader";
import ReaderSettings from "./Reader/Settings";
import { useReaderSettings } from "Hooks/useReaderSettings";

const Swipeable = ({ enabled, children, ...props }) => {
  const handlers = useSwipeable(props);
  return (
    enabled ? <div
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
    </div> : children
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
  const [showReaderSettings, setShowReaderSettings] = useState(false)
  const [textSelectMode, setTextSelectMode] = useState(false)
  const { theme, setFont, setFontSize } = useReaderSettings()

  function handleGetRendition(rendition) {
    setRendition(rendition);
    getRendition(rendition);
  }

  useEffect(() => {
    if (!rendition) {
      return;
    }

    rendition.themes.font(theme.font)
    rendition.themes.fontSize(`${theme.fontSize}px`)
    rendition.start()
  }, [theme])
  return (
    <>
      <Swipeable
        enabled={!textSelectMode}
        onSwipedRight={() => rendition.prev()}
        onSwipedLeft={() => rendition.next()}
        onSwipedUp={() => setShowReaderSettings(true)}
        onTap={() => setTextSelectMode(true)}
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
      {showReaderSettings && <ReaderSettings
        theme={theme}
        onFontChange={setFont}
        onFontSizeChange={setFontSize}
        onClose={() => setShowReaderSettings(false)}
      />}
    </>
  );
}
