import { gql } from "@apollo/client";

export const EPUB_QUERY = gql`
  query EPUB {
    epubs {
      edges {
        node {
          id
          filename
          filePath
          book {
            id
            title
            description
            coverPath
            authors {
              id
              name
            }
          }
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasNextPage
      }
    }
  }
`;

export const EPUB_BYID_QUERY = gql`
  query EPUB($epubId: String!) {
    epub: epubById(epubId: $epubId) {
      id
      filename
      filePath
    }
  }
`;

export const IMPORT_EPUB_MUTATION = gql`
  mutation IMPORT_EPUB($upload: Upload!) {
    epub: uploadEPub(data: { upload: $upload }) {
      id
      filename
      filePath
      book {
        id
        title
        description
        coverPath
        authors {
          id
          name
        }
      }
    }
  }
`;
