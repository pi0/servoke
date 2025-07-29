# servoke

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/servoke?color=yellow)](https://npmjs.com/package/servoke)
[![npm downloads](https://img.shields.io/npm/dm/servoke?color=yellow)](https://npm.chart.dev/servoke)

<!-- /automd -->

Locally invoke any server handler.

✅ Support Web and Node.js compatible handlers.

✅ Does not requires listening server.

✅ Auto detects module based on export signature.

> ![WARNING]
> This is an experimental idea!
> Express is notably incompatible currently with node adapter.

## Usage

Install the package:

```sh
# ✨ Auto-detect (supports npm, yarn, pnpm, deno and bun)
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
} from "servoke";
```

<!-- /automd -->

### `invokeModule`

**Example:**

<!-- automd:file code src="./examples/_node-handler.mjs" -->

```mjs [_node-handler.mjs]
export default function nodeHandler(req, res) {
  res.setHeader("Content-Type", "text/plain");
  res.end(JSON.stringify({ url: req.url }));
}
```

<!-- /automd -->

<!-- automd:file code src="./examples/invoke-module.mjs" -->

```mjs [invoke-module.mjs]
import { invokeModule } from "servoke";

const handler = await import("./_node-handler.mjs");
const res = await invokeModule(handler, "/test");
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
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

</details>

## License

Published under the [MIT](https://github.com/unjs/servoke/blob/main/LICENSE) license 💛.
