import { invokeModule } from "servoke";

const handler = await import("./_node-handler.mjs");
const res = await invokeModule(handler, "/test");
console.log(await res.json()); // { url: '/test' }
