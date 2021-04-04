import { Edge } from "graphql-relay";
import { ClassType, Field, ObjectType } from "type-graphql";

import { Connection } from "Relay/interfaces/Connection";
import { PageInfo } from "Relay/PageInfo";

type NodeType<E> = E extends Edge<infer N> ? N : unknown;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function ConnectionType<E extends Edge<N>, N = NodeType<E>>(
  EdgeType: ClassType<E>
) {
  @ObjectType({ isAbstract: true })
  abstract class ConnectionClass implements Connection<N> {
    @Field(() => [EdgeType], {
      description: "A list of edges.",
      nullable: "itemsAndList",
    })
    readonly edges!: Array<E>;

    @Field({ description: "Information to aid in pagination." })
    readonly pageInfo!: PageInfo;

    @Field({
      description: "Identifies the total count of items in the connection.",
    })
    readonly totalCount!: number;
  }

  return ConnectionClass;
}
