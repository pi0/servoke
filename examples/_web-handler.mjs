export default function webHandler(req) {
  return Response.json({ url: req.url });
}
