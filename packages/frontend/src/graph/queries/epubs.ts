import { gql } from "@apollo/client";
import { EPubFragment } from "Types/EPub";
import { MetadataFragment } from "Types/Metadata";

export const EPUB_QUERY = gql`
  query EPUB {
    library {
      edges {
        node {
          ...EPubFragment
          metadata {
            ...MetadataFragment
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
  ${EPubFragment}
  ${MetadataFragment}
`;

export const EPUB_BYID_QUERY = gql`
  query EPUB($epubId: String!) {
    epub: epubById(epubId: $epubId) {
      ...EPubFragment
      metadata {
        ...MetadataFragment
      }
    }
  }
  ${EPubFragment}
  ${MetadataFragment}
`;

export const CREATE_EPUB_MUTATION = gql`
  mutation CREATE_EPUB($data: CreateEPubInput!) {
    epub: createEPub(data: $data) {
      ...EPubFragment
      metadata {
        ...MetadataFragment
      }
    }
  }
  ${EPubFragment}
  ${MetadataFragment}
`;

export const UPDATE_EPUB_MUTATION = gql`
  mutation UPDATE_EPUB($epubId: String!, $data: UpdateEPubInput!) {
    epub: updateEPub(epubId: $epubId, data: $data) {
      ...EPubFragment
    }
  }
  ${EPubFragment}
`;
