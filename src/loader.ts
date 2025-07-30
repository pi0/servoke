import { Server } from "node:http";

import { nodeToWebHandler, toWebHandler } from "./adapter.ts";
import type { EntryModule, NodeHandler, WebHandler } from "./types.ts";

/**
 * Loads a web handler from the specified module ID.
 */
export async function loadAsWebHandler(id: URL | string): Promise<WebHandler> {
  const listenHook = spyOnNodeHTTP();
  try {
    const mod = (await loadModule(id)) as EntryModule;
    const requestListener = listenHook?.getHandler();
    const handler = requestListener
      ? nodeToWebHandler(requestListener)
      : toWebHandler(mod);
    return handler;
  } finally {
    listenHook?.revert();
  }
}

function spyOnNodeHTTP() {
  const originalListen = Server.prototype.listen;
  let handler: NodeHandler;
  // @ts-expect-error
  Server.prototype.listen = function (this: Server) {
    // https://github.com/nodejs/node/blob/af77e4bf2f8bee0bc23f6ee129d6ca97511d34b9/lib/_http_server.js#L557
    // @ts-expect-error
    handler = this._events.request;
    Server.prototype.listen = originalListen;
  };
  return {
    revert: () => {
      Server.prototype.listen = originalListen;
    },
    getHandler: () => {
      return handler;
    },
  };
}

async function loadModule(id: URL | string): Promise<unknown> {
  const mod = await import(id.toString());
  return mod;
}
