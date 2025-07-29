import { Server } from "node:http";

const server = new Server((req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.end(JSON.stringify({ url: req.url }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
