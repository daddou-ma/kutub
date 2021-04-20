import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useTranslation } from "react-i18next";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Checkbox,
} from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";

import { BasicLayout } from "Layouts/BasicLayout";
import { EPUB_QUERY, IMPORT_EPUB_MUTATION } from "Graph/queries/epubs";

export interface Author {
  name: string;
}

export interface EPub {
  filename: string;
  filePath: string;
}

export interface Book {
  title: string;
  description?: string;
}

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
            fragment: gql`
              fragment CreatedEPub on EPub {
                filename
                filePath
              }
            `,
            data: epub,
          });
          return existingEPubs;
        },
        books({ existingBooks }) {
          cache.writeFragment({
            id: `Book:${epub?.book?.id}`,
            fragment: gql`
              fragment CreatedBook on Book {
                id
                title
                description
                publisher
              }
            `,
            data: epub,
          });
          return existingBooks;
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
            <ListItem alignItems="flex-start" key={node.id}>
              <ListItemAvatar>
                <img
                  width={48}
                  alt={node?.book?.title}
                  src={"http://localhost:4000/" + node?.book?.coverPath}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Link
                    style={{
                      color: "#333",
                      fontWeight: "bold",
                      textDecoration: "none",
                    }}
                    to={`/reader/${node.id}`}
                  >
                    {node?.book?.title.slice(0, 48)}
                  </Link>
                }
                secondary={
                  <React.Fragment>{`by ${node?.book?.authors.map(
                    ({ name }) => name
                  )}`}</React.Fragment>
                }
              />
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                checked={false}
                onChange={(e) => console.log(e, node.id)}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
    </BasicLayout>
  );
}
