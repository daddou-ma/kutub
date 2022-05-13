import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { List, IconButton } from "@material-ui/core";
import { LectureFragment } from "Types/index";

import { LibraryItem } from "Components/LibraryItem";
import { BasicLayout } from "Layouts/BasicLayout";
import { LECTURE_QUERY, CREATE_LECTURE_MUTATION } from "Graph/queries/lectures";
import { useSnackbar } from "Hooks/useSnackbar";
import { Add as AddIcon } from "@material-ui/icons";
import { UploadProgress } from "Components/UploadProgress";
import { getEPubFileCover, getEPubFileMetaData } from "Utils/EPub";
import { saveFileToCache } from "Utils/File";

export default function LibraryPage(): React.ReactElement {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const fileRef = useRef(null);
  const { loading, error, data } = useQuery(LECTURE_QUERY);
  const [createEPub] = useMutation(CREATE_LECTURE_MUTATION, {
    onCompleted: async ({ lecture: { filePath, coverPath }}) => {

      saveFileToCache(file, 'cached-epubs', filePath)
      saveFileToCache(await getEPubFileCover(file), 'cached-covers', coverPath)

      setFile(null);
      setProgress(0);
      showSnackbar(t("EPub Book Added"));
    },
    update: handleCacheUpdate,
    context: {
      fetchOptions: {
        useUpload: true,
        onProgress: ({ loaded, total }: ProgressEvent) =>
          setProgress(Math.ceil((loaded / total) * 100)),
      },
    },
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

  async function handleImport({
    target: {
      validity,
      files: [file],
    },
  }: any): Promise<void> {
    if (!validity.valid) return;
    setFile(file);
    createEPub({ variables: { data: {
      metadata: await getEPubFileMetaData(file)
    }}});
  }

  return (
    <BasicLayout
      title={t("My Books")}
      loading={loading}
      error={!data && error}
      actions={
        <IconButton onClick={() => fileRef.current.click()}>
          <AddIcon />
        </IconButton>
      }
    >
      <>
        <input
          type="file"
          accept=".epub"
          style={{ display: "none" }}
          ref={fileRef}
          onChange={handleImport}
        />
      </>
      {file && <UploadProgress filename={file?.name} progress={progress} />}
      <List>
        {data &&
          data.library.edges.map(({ node }) => (
            <LibraryItem lecture={node} key={node.id} />
          ))}
      </List>
    </BasicLayout>
  );
}
