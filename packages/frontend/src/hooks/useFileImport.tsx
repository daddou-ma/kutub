import { useMutation } from "@apollo/client";
import { CREATE_LECTURE_MUTATION } from "Graph/queries/lectures";
import React, { useState, useContext, createContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { LectureFragment } from "Types/Lecture";
import { getEPubFileCover, getEPubFileMetaData } from "Utils/EPub";
import { saveFileToCache } from "Utils/File";
import { useSnackbar } from "./useSnackbar";

interface FileImportProviderProps {
  children: React.ReactElement;
}

interface FileImportContext {
  file: File;
  selectFile: CallableFunction;
  handleFileImport: CallableFunction;
}

const fileImportContext = createContext(null);

export function FileImportProvider({
  children,
}: FileImportProviderProps): React.ReactElement {
  const { t } = useTranslation()
  const { showSnackbar } = useSnackbar();
  const fileRef = useRef()
  const [file, setFile] = useState(null)

  const [createEPub] = useMutation(CREATE_LECTURE_MUTATION, {
    onCompleted: async ({ lecture: { filePath, coverPath }}) => {

      saveFileToCache(file, 'cached-epubs', filePath)
      saveFileToCache(await getEPubFileCover(file), 'cached-covers', coverPath)

      setFile(null);
      showSnackbar(t("EPub Book Added"));
    },
    update: handleCacheUpdate,
  });

  function handleCacheUpdate(cache, { data: { lecture } }) {
    cache.modify({
      fields: {
        library({ existingLibrary }) {
          cache.writeFragment({
            id: `Lecture:${lecture?.id}`,
            fragment: LectureFragment,
            data: lecture,
          });
          return existingLibrary;
        },
      },
    });
  }

  async function handleFileImport(file: File): Promise<void> {
    setFile(file);
    createEPub({ variables: { data: {
      metadata: await getEPubFileMetaData(file)
    }}});
  }

  function selectFile() {
    if(!fileRef.current) {
      return
    }
    
    (fileRef.current as any).click()
  }
  return (
    <fileImportContext.Provider value={{ file, selectFile, handleFileImport }}>
      <>
        {children}
        <input
          type="file"
          accept=".epub"
          style={{ display: "none" }}
          ref={fileRef}
          onChange={({ target: { validity, files }}) => validity.valid && handleFileImport(files[0])}
        />
      </>
    </fileImportContext.Provider>
  );
}

export function useFileImport(): FileImportContext {
  return useContext(fileImportContext);
}
