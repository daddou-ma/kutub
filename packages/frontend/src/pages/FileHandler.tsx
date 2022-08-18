import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { BasicLayout } from "Layouts/BasicLayout";
import { useFileImport } from "Hooks/useFileImport";

export default function LibraryPage(): React.ReactElement {
  const { t } = useTranslation();
  const { handleFileImport } = useFileImport()

  useEffect(() => {
    async function loadFile(fileHandle) {
      await handleFileImport(await fileHandle.getFile())
    }
    if ('launchQueue' in window && 'files' in (window as any).LaunchParams.prototype) {
      (window as any).launchQueue.setConsumer((launchParams) => {
        if (!launchParams.files.length) {
          return;
        }
        for (const fileHandle of launchParams.files) {
          loadFile(fileHandle)
        }
      });
    }
  }, [])


  return (
    <BasicLayout
      title={t("File Import")}
    >
     <div>
      Importing File
     </div>
    </BasicLayout>
  );
}
