import { ObjectType } from "type-graphql";

import { EdgeType } from "Relay/generics/Edge";
import Device from "Modules/devices/Device.entity";

@ObjectType()
export class DeviceEdge extends EdgeType(Device) {}
