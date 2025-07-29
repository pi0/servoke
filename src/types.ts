import type { IncomingMessage, ServerResponse } from "node:http";

export type WebHandler = (req: Request) => Response | Promise<Response>;
export type Fetchable = { fetch: WebHandler };

export type NodeHandler = (
  req: IncomingMessage,
  res: ServerResponse,
) => unknown | Promise<unknown>;

type MaybeDefault<T> = T | { default: T };
export type EntryModule = MaybeDefault<NodeHandler | WebHandler | Fetchable>;
