import { toReqRes, toFetchResponse } from "fetch-to-node";

import type {
  EntryModule,
  Fetchable,
  NodeHandler,
  WebHandler,
} from "./types.ts";

const ERR_NO_COMPATIBLE_HANDLER =
  "Module does not exports any compatible handler!";

/**
 * Automatically convert imported module with unknown exports (Node.js or Web syntax) to a fetch-compatible Web handler (`(Request) => Promise<Response>`).
 *
 * Throws an error if no compatible handler is found.
 */
export function toWebHandler(
  mod: EntryModule,
  opts?: { debug?: boolean },
): WebHandler {
  if (!mod) {
    throw new Error(ERR_NO_COMPATIBLE_HANDLER);
  }

  // Fetchable interface
  const _fetch =
    (mod as Fetchable).fetch || (mod as { default?: Fetchable }).default?.fetch;
  if (_fetch) {
    return _fetch as WebHandler;
  }

  // Ambiguous function export
  const fn =
    typeof mod === "function"
      ? mod
      : typeof (mod as { default: any })?.default === "function"
        ? (mod as { default: WebHandler | NodeHandler }).default
        : undefined;

  if (!fn) {
    throw new Error(ERR_NO_COMPATIBLE_HANDLER);
  }

  // Guess based on number of arguments
  // (webReq) => WebResponse
  // (nodeReq, nodeRes) => {}
  return fn.length === 1
    ? (fn as WebHandler)
    : nodeToWebHandler(fn as NodeHandler, opts);
}

/**
 * Convert a Node handler (`(req, res) => {...}`) to a fetch-compatible Web handler (`(Request) => Promise<Response>`).
 */
export function nodeToWebHandler(
  nodeHandler: NodeHandler,
  opts?: { debug?: boolean },
): WebHandler {
  return async (webReq) => {
    try {
      // https://github.com/mhart/fetch-to-node
      const { req: nodeReq, res: nodeRes } = toReqRes(webReq);
      await nodeHandler(nodeReq, nodeRes);
      const webResponse = await toFetchResponse(nodeRes);
      return webResponse;
    } catch (error) {
      if (opts?.debug) {
        console.error(error);
      }
      return new Response("Internal Server Error", {
        status: 500,
        statusText: "Internal Server Error",
      });
    }
  };
}
