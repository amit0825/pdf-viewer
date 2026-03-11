// api/proxy.js
export default async function handler(req, res) {
  const fileUrl = req.query.url;

  // 1. Check for URL
  if (!fileUrl) {
    return res.status(400).send('Missing "url" query parameter');
  }

  try {
    // 2. Fetch the PDF from the external source
    const response = await fetch(fileUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    // 3. Handle errors from the external source
    if (!response.ok) {
      return res
        .status(response.status)
        .send("Error fetching file from source");
    }

    // 4. Get the raw data (ArrayBuffer)
    const arrayBuffer = await response.arrayBuffer();

    // 5. Set headers and send back to frontend
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", arrayBuffer.byteLength);
    // Allow all origins (CORS)
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).send("Internal Server Error");
  }
}
