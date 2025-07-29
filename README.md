# servoke

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/servoke?color=yellow)](https://npmjs.com/package/servoke)
[![npm downloads](https://img.shields.io/npm/dm/servoke?color=yellow)](https://npm.chart.dev/servoke)

<!-- /automd -->

Locally invoke any server handler.

✅ Support Web and Node.js compatible handlers.

✅ Does not require a listening server.

✅ Auto detects module based on export signature.

✅ Loader with auto spy to support server entries that are directly listening server.

✅ Zero dependencies.

> [!IMPORTANT]
> This is an experimental idea!

## Usage

Install the package:

```sh
# ✨ Auto-detect (supports npm, yarn, pnpm, deno, and bun)
npx nypm install servoke
```

Import:

<!-- automd:jsimport src="./src/index.ts" -->

**ESM** (Node.js, Bun, Deno)

```js
import {
  toWebHandler,
  nodeToWebHandler,
  invokeWebHandler,
  invokeModule,
  loadAsWebHandler,
} from "servoke";
```

<!-- /automd -->

### `loadAsWebHandler`

`loadAsWebHandler` is the main utility from this package. It:

- Initiates a spy on `node:http:Server.listen`
- Loads module using dynamic `import()`
- If no `listen` call is detected, tries to detect module exports using `toWebHandler` (if exports are not fetch-compatible, will be converted using `nodeToWebHandler`)

You can then directly call the loaded web handler (`Request => Promise<Response>`) or use `invokeWebHandler` for more convenience.

**Example:**

<!-- automd:file code src="./examples/_node-server.mjs" -->

```mjs [_node-server.mjs]
import Express from "express";

const app = Express().use("/", (req, res) => {
  res.json({ url: req.url });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

<!-- /automd -->

<!-- automd:file code src="./examples/load-server.mjs" -->

```mjs [load-server.mjs]
import { loadAsWebHandler, invokeWebHandler } from "servoke";

const webHandler = await loadAsWebHandler(
  new URL("_node-server.mjs", import.meta.url),
);

const res = await invokeWebHandler(webHandler, "/test");

console.log(await res.json()); // { url: '/test' }
```

<!-- /automd -->

## Adapter Utils

<!-- automd:jsdocs src="./src/adapter.ts" -->

### `nodeToWebHandler(nodeHandler)`

Convert a Node handler (`(req, res) => {...}`) to a fetch-compatible Web handler (`(Request) => Promise<Response>`).

### `toWebHandler(mod)`

Automatically convert imported module with unknown exports (Node.js or Web syntax) to a fetch-compatible Web handler (`(Request) => Promise<Response>`).

Throws an error if no compatible handler is found.

<!-- /automd -->

## Development

<details>

<summary>local development</summary>

- Clone this repository
- Install the latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

</details>

## License

Published under the [MIT](https://github.com/unjs/servoke/blob/main/LICENSE) license 💛.
