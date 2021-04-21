import React, { useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { List, Divider } from "@material-ui/core";
import {
  EPubFragment,
  BookFragment,
  AuthorFragment,
  Author,
} from "Types/index";

import { LibraryItem } from "Components/LibraryItem";
import { BasicLayout } from "Layouts/BasicLayout";
import { EPUB_QUERY, IMPORT_EPUB_MUTATION } from "Graph/queries/epubs";

export function LibraryPage(): React.ReactElement {
  const { t } = useTranslation();
  const fileRef = useRef(null);
  const { loading, error, data } = useQuery(EPUB_QUERY);
  const [importEPub] = useMutation(IMPORT_EPUB_MUTATION, {
    onCompleted: console.log,
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
        // books({ existingBooks }) {
        //   cache.writeFragment({
        //     id: `Book:${epub?.book?.id}`,
        //     fragment: BookFragment,
        //     data: epub?.book,
        //   });
        //   return existingBooks;
        // },
        // authors({ existingAuthors }) {
        //   epub?.book?.authors.forEach((author: Author) => {
        //     cache.writeFragment({
        //       id: `Book:${author.id}`,
        //       fragment: AuthorFragment,
        //       data: author,
        //     });
        //   });
        //   return existingAuthors;
        // },
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
    console.log(file);
    importEPub({ variables: { upload: file } });
  }

  if (loading) return <>Loading...</>;

  if (error) return <>Error! {error.message}</>;

  return (
    <BasicLayout
      title={t("My Books")}
      actions={[
        {
          name: t("Import Book"),
          onClick: () => fileRef.current.click(),
        },
      ]}
    >
      <>
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileRef}
          onChange={handleImport}
        />
      </>
      <List>
        {data.epubs.edges.map(({ node }) => (
          <>
            <LibraryItem epub={node} />
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
    </BasicLayout>
  );
}
