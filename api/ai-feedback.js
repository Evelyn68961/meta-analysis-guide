// api/ai-feedback.js
// Vercel serverless function — proxies AI requests to Anthropic API
// so the API key stays hidden server-side.
//
// Setup:
//   1. Place this file at <project-root>/api/ai-feedback.js
//   2. Add ANTHROPIC_API_KEY to Vercel → Settings → Environment Variables
//   3. For local dev, add ANTHROPIC_API_KEY to .env.local (gitignored)
//   4. Run with `vercel dev` (not `npm run dev`) to test locally

export default async function handler(req, res) {
  // CORS headers (allows your Vercel-hosted frontend to call this)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only POST allowed
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { system, userMessage } = req.body;

  if (!system || !userMessage) {
    return res.status(400).json({ error: "Missing required fields: system, userMessage" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured on server" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: system,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "API call failed", details: err.message });
  }
}
