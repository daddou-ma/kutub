import { Edge } from "Types/index";

export interface Connection<N> {
  edges: Array<Edge<N>>;
  pageInfo: string;
  totalCount: number;
}
