export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      res.status(400).send("Missing url");
      return;
    }

    const decoded = Buffer.from(url, "base64").toString("utf8");

    const response = await fetch(decoded);

    if (!response.ok) {
      res.status(500).send("Fetch failed");
      return;
    }

    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(buffer));
  } catch (e) {
    console.error(e);
    res.status(500).send("Proxy error");
  }
}
