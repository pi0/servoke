import { Server } from "node:http";
import nodeHandler from "./node-handler.mjs";

const server = new Server((req, res) => {
  try {
    nodeHandler(req, res);
  } catch (error) {
    res.statusCode = 500;
    res.end(`Error: ${error.message}`);
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
