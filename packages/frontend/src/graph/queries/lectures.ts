import { gql } from "@apollo/client";
import { LectureFragment } from "Types/Lecture";
import { MetadataFragment } from "Types/Metadata";

export const LECTURE_QUERY = gql`
  query LECTURE {
    library {
      edges {
        node {
          ...LectureFragment
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
  ${LectureFragment}
  ${MetadataFragment}
`;

export const LECTURE_BYID_QUERY = gql`
  query LECTURE($lectureId: String!) {
    lecture: lectureById(lectureId: $lectureId) {
      ...LectureFragment
      metadata {
        ...MetadataFragment
      }
    }
  }
  ${LectureFragment}
  ${MetadataFragment}
`;

export const CREATE_LECTURE_MUTATION = gql`
  mutation CREATE_LECTURE($data: CreateLectureInput!) {
    lecture: createLecture(data: $data) {
      ...LectureFragment
      metadata {
        ...MetadataFragment
      }
    }
  }
  ${LectureFragment}
  ${MetadataFragment}
`;

export const UPDATE_LECTURE_MUTATION = gql`
  mutation UPDATE_LECTURE($lectureId: String!, $data: UpdateLectureInput!) {
    lecture: updateLecture(lectureId: $lectureId, data: $data) {
      ...LectureFragment
    }
  }
  ${LectureFragment}
`;
