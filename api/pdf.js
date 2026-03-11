export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    res.status(400).send("Missing url");
    return;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      res.status(500).send("Failed to fetch PDF");
      return;
    }

    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(buffer));
  } catch (e) {
    res.status(500).send("Error fetching PDF");
  }
}
