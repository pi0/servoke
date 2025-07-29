import { describe, expect, it } from "vitest";
import { toWebHandler } from "../src/index.ts";
import * as fixtures from "./fixtures/index.ts";

const cases = {
  node: fixtures.nodeHandler,
  // express: fixtures.express,
  "node-default": { default: fixtures.nodeHandler },
  web: fixtures.webHandler,
  "web-default": { default: fixtures.webHandler },
  fetchable: { fetch: fixtures.webHandler },
  "fetchable-default": { default: { fetch: fixtures.webHandler } },
};

describe("adapter", () => {
  describe("toWebHandler", () => {
    for (const [name, mod] of Object.entries(cases)) {
      it(`should convert ${name} to a Web handler`, async () => {
        const webHandler = toWebHandler(mod, { debug: true });
        expect(webHandler).toBeInstanceOf(Function);
        expect(webHandler.length).toBe(1);

        // Test the handler
        const req = new Request("http://example.com");
        const res = await webHandler(req);
        expect(res).toBeInstanceOf(Response);
        expect(await res.text()).toBe("OK!");
        expect(res.status).toBe(200);
        expect(res.statusText).toBe("OK");
        expect(res.headers.get("Content-Type")).toBe("text/plain");
      });
    }

    it("should throw if module is undefined", () => {
      expect(() => toWebHandler(undefined as any)).toThrow();
    });

    it("should throw if module does not export a compatible handler", () => {
      expect(() => toWebHandler({ default: "hello" } as any)).toThrow();
    });
  });
});
