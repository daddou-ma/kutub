import { gql } from "@apollo/client";

export abstract class Device {
  id: string;
  os: string;
}

export const DeviceFragment = gql`
  fragment DeviceFragment on Device {
    id
    browserName
    browserVersion
    os
    description
  }
`;
