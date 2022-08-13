import React, { useState } from "react";
import { useQuery} from "@apollo/client";
import { useTranslation } from "react-i18next";
import { List, IconButton } from "@material-ui/core";

import { LibraryItem } from "Components/LibraryItem";
import { BasicLayout } from "Layouts/BasicLayout";
import { LECTURE_QUERY } from "Graph/queries/lectures";
import { Add as AddIcon } from "@material-ui/icons";
import { UploadProgress } from "Components/UploadProgress";
import { useFileImport } from "Hooks/useFileImport";

export default function LibraryPage(): React.ReactElement {
  const { t } = useTranslation();
  const { file, importFile } = useFileImport()
  const { loading, error, data } = useQuery(LECTURE_QUERY);

  return (
    <BasicLayout
      title={t("My Books")}
      loading={loading}
      error={!data && error}
      actions={
        <IconButton onClick={() => importFile()}>
          <AddIcon />
        </IconButton>
      }
    >
      {file && <UploadProgress filename={file?.name} progress={5} />}
      <List>
        {data &&
          data.library.edges.map(({ node }) => (
            <LibraryItem lecture={node} key={node.id} />
          ))}
      </List>
    </BasicLayout>
  );
}
