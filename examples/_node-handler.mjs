export default function nodeHandler(req, res) {
  res.setHeader("Content-Type", "text/plain");
  res.end(JSON.stringify({ url: req.url }));
}
