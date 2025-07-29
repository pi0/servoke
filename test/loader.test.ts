import { describe, it, expect } from "vitest";
import { invokeWebHandler, loadAsWebHandler } from "../src";

describe("loader", () => {
  describe("loadAsWebHandler", () => {
    it("node-handler", async () => {
      const handler = await loadAsWebHandler(
        new URL("fixtures/node-handler.mjs", import.meta.url),
      );
      const res = await invokeWebHandler(handler, "/");
      await expect(res.text()).resolves.toBe("OK!");
    });

    it("node-server", async () => {
      const handler = await loadAsWebHandler(
        new URL("fixtures/node-server.mjs", import.meta.url),
      );
      const res = await invokeWebHandler(handler, "/");
      await expect(res.text()).resolves.toBe("OK!");
    });
  });
});
