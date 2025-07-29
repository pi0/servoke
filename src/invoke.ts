import { toWebHandler } from "./adapter.ts";
import type { EntryModule, WebHandler } from "./types.ts";

export async function invokeModule(
  mod: EntryModule,
  req: URL | Request | string,
  init?: RequestInit & { debug?: boolean },
): Promise<Response> {
  const webHandler = toWebHandler(mod);
  return invokeWebHandler(webHandler, req, init);
}

export async function invokeWebHandler(
  handler: WebHandler,
  req: URL | Request | string,
  init?: RequestInit,
): Promise<Response> {
  const request = toRequest(req, init);
  try {
    const res = await handler(request);
    return res;
  } catch {
    return new Response("Internal Server Error", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}

// https://github.com/h3js/h3/blob/ab774c6dbca42ed34e1bc3710b634519ac86641e/src/h3.ts#L220C8-L238C2
function toRequest(
  _request: Request | URL | string,
  _init?: RequestInit,
): Request {
  if (typeof _request === "string") {
    let url = _request;
    if (url[0] === "/") {
      const headers = _init?.headers ? new Headers(_init.headers) : undefined;
      const host = headers?.get("host") || "localhost";
      const proto =
        headers?.get("x-forwarded-proto") === "https" ? "https" : "http";
      url = `${proto}://${host}${url}`;
    }
    return new Request(url, _init);
  } else if (_init || _request instanceof URL) {
    return new Request(_request, _init);
  }
  return _request;
}
