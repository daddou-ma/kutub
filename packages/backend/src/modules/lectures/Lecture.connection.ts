import { ObjectType } from "type-graphql";

import { ConnectionType } from "Relay/generics/Connection";
import { LectureEdge } from "Modules/lectures/Lecture.edge";

@ObjectType()
export class LectureConnection extends ConnectionType(LectureEdge) {}
