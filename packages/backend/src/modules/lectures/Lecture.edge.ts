import { ObjectType } from "type-graphql";

import { EdgeType } from "Relay/generics/Edge";
import Lecture from "Modules/lectures/Lecture.entity";

@ObjectType()
export class LectureEdge extends EdgeType(Lecture) {}
