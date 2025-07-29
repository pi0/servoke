import { describe, expect, it } from "vitest";
import * as fixtures from "./fixtures/index.ts";
import { invokeModule } from "../src/invoke.ts";

const cases = {
  node: fixtures.nodeHandler,
  web: fixtures.webHandler,
};

describe("invokeModule", () => {
  for (const [name, mod] of Object.entries(cases)) {
    it(`${name} works`, async () => {
      const res = await invokeModule(mod, "/");
      expect(res).toBeInstanceOf(Response);
      expect(res.status).toBe(200);
      expect(res.statusText).toBe("OK");
      expect(res.headers.get("Content-Type")).toBe("text/plain");
      expect(await res.text()).toBe("OK!");
    });
  }
});
