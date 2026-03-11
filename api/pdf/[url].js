export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      res.status(400).send("Missing url");
      return;
    }

    // convert base64url → base64
    let base64 = url.replace(/-/g, "+").replace(/_/g, "/");

    // add padding if missing
    while (base64.length % 4) {
      base64 += "=";
    }

    const decodedUrl = Buffer.from(base64, "base64").toString("utf8");

    const response = await fetch(decodedUrl);

    if (!response.ok) {
      res.status(response.status).send("Failed to fetch PDF from source");
      return;
    }

    const arrayBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Cache-Control", "no-store");

    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error(err);
    res.status(500).send("Proxy error");
  }
}
