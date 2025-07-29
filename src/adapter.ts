import type {
  EntryModule,
  Fetchable,
  NodeHandler,
  WebHandler,
} from "./types.ts";
import { Server } from "node:http";

const ERR_NO_COMPATIBLE_HANDLER =
  "Module does not exports any compatible handler!";

/**
 * Automatically convert imported module with unknown exports (Node.js or Web syntax) to a fetch-compatible Web handler (`(Request) => Promise<Response>`).
 *
 * Throws an error if no compatible handler is found.
 */
export function toWebHandler(mod: EntryModule): WebHandler {
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
    : nodeToWebHandler(fn as NodeHandler);
}

/**
 * Convert a Node handler (`(req, res) => {...}`) to a fetch-compatible Web handler (`(Request) => Promise<Response>`).
 */
export function nodeToWebHandler(nodeHandler: NodeHandler): WebHandler {
  /**
   * We could use emulation via https://npmjs.com/fetch-to-node or https://npmjs.com/node-mock-http
   * But they often come with edge cases and limitations for example express overrides req/res prototype
   * Since main usage of this library is one-off invocations, cost of temporary server creation is negligible.
   */
  return async (webReq) => {
    const server = new Server(nodeHandler);
    await new Promise<void>((resolve) => {
      server.listen(0, "localhost", resolve);
    });
    const { port } = server.address() as { port: number };
    const originalUrl = new URL(webReq.url);
    const url = new URL(
      originalUrl.pathname + originalUrl.search,
      `http://localhost:${port}`,
    );
    try {
      return await fetch(url, webReq);
    } finally {
      server.close();
    }
  };
}
