import Express from "express";

const app = Express().use("/", (req, res) => {
  res.json({ url: req.url });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
