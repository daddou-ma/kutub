import { ObjectType } from "type-graphql";

import { ConnectionType } from "Relay/generics/Connection";
import { DeviceEdge } from "Modules/devices/Device.edge";

@ObjectType()
export class DeviceConnection extends ConnectionType(DeviceEdge) {}
