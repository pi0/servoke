import { loadAsWebHandler, invokeWebHandler } from "servoke";

const webHandler = await loadAsWebHandler(
  new URL("_node-server.mjs", import.meta.url),
);

const res = await invokeWebHandler(webHandler, "/test");

console.log(await res.json()); // { url: '/test' }
