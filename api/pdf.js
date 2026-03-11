export default async function handler(req, res) {
  try {
    // rebuild full url after "url="
    const raw = req.url.split("url=")[1];

    if (!raw) {
      res.status(400).send("Missing url parameter");
      return;
    }

    const pdfUrl = decodeURIComponent(raw);

    const response = await fetch(pdfUrl);

    if (!response.ok) {
      res.status(response.status).send("Failed to fetch PDF");
      return;
    }

    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Cache-Control", "no-store");

    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error(err);

    res.status(500).send("Proxy error");
  }
}
