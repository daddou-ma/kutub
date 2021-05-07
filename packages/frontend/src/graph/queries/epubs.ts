import { gql } from "@apollo/client";
import { AuthorFragment } from "Types/Author";
import { EPubFragment } from "Types/EPub";
import { BookFragment } from "Types/Book";

export const EPUB_QUERY = gql`
  query EPUB {
    library {
      edges {
        node {
          ...EPubFragment
          book {
            ...BookFragment
            authors {
              edges {
                node {
                  ...AuthorFragment
                }
                cursor
              }
              totalCount
            }
          }
        }
        cursor
      }
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasNextPage
      }
    }
  }
  ${AuthorFragment}
  ${BookFragment}
  ${EPubFragment}
`;

export const EPUB_BYID_QUERY = gql`
  query EPUB($epubId: String!) {
    epub: epubById(epubId: $epubId) {
      ...EPubFragment
      book {
        ...BookFragment
        authors {
          edges {
            node {
              ...AuthorFragment
            }
            cursor
          }
          totalCount
        }
      }
    }
  }
  ${AuthorFragment}
  ${BookFragment}
  ${EPubFragment}
`;

export const IMPORT_EPUB_MUTATION = gql`
  mutation IMPORT_EPUB($upload: Upload!) {
    epub: uploadEPub(data: { upload: $upload }) {
      ...EPubFragment
      book {
        ...BookFragment
        authors {
          edges {
            node {
              ...AuthorFragment
            }
            cursor
          }
          totalCount
        }
      }
    }
  }
  ${AuthorFragment}
  ${BookFragment}
  ${EPubFragment}
`;

export const UPDATE_EPUB_MUTATION = gql`
  mutation UPDATE_EPUB($epubId: String!, $data: UpdateEPubInput!) {
    epub: updateEPub(epubId: $epubId, data: $data) {
      ...EPubFragment
    }
  }
  ${EPubFragment}
`;
