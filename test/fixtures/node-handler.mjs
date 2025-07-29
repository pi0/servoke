export default function nodeHandler(_req, res) {
  res.setHeader("Content-Type", "text/plain");
  setImmediate(() => {
    res.end("OK!");
  });
}
