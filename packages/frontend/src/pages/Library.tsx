import React, { useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { List, IconButton } from "@material-ui/core";
import { EPubFragment } from "Types/index";

import { LibraryItem } from "Components/LibraryItem";
import { BasicLayout } from "Layouts/BasicLayout";
import { EPUB_QUERY, IMPORT_EPUB_MUTATION } from "Graph/queries/epubs";
import { useSnackbar } from "Hooks/useSnackbar";
import { Add as AddIcon } from "@material-ui/icons";

export function LibraryPage(): React.ReactElement {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const fileRef = useRef(null);
  const { loading, error, data } = useQuery(EPUB_QUERY);
  const [importEPub] = useMutation(IMPORT_EPUB_MUTATION, {
    onCompleted: () => showSnackbar(t("EPub Book Added")),
    update: handleCacheUpdate,
  });

  function handleCacheUpdate(cache, { data: { epub } }) {
    cache.modify({
      fields: {
        epubs({ existingEPubs }) {
          cache.writeFragment({
            id: `EPub:${epub?.id}`,
            fragment: EPubFragment,
            data: epub,
          });
          return existingEPubs;
        },
      },
    });
  }

  function handleImport({
    target: {
      validity,
      files: [file],
    },
  }: any): void {
    if (!validity.valid) return;
    importEPub({ variables: { upload: file } });
  }

  if (error) return <>Error! {error.message}</>;

  return (
    <BasicLayout
      title={t("My Books")}
      loading={loading}
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
      <List>
        {data &&
          data.epubs.edges.map(({ node }) => (
            <LibraryItem epub={node} key={node.id} />
          ))}
      </List>
    </BasicLayout>
  );
}
