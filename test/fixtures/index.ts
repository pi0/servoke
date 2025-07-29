import type { IncomingMessage, ServerResponse } from "node:http";
import Express from "express";

export function nodeHandler(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "text/plain");
  setImmediate(() => {
    res.end("OK!");
  });
}

export const express = Express().get("/", (_req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.end("OK!");
});

export function webHandler(_req: Request): Response {
  return new Response("OK!", {
    status: 200,
    statusText: "OK",
    headers: { "Content-Type": "text/plain" },
  });
}
