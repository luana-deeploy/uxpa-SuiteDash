// /api/webflow-to-suitedash.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  // 🔹 Log completo do webhook para inspecionar
  console.log("Recebido do Webflow:", JSON.stringify(payload, null, 2));
  
  const payload = req.body; // Webflow envia todos os campos do form
  const emailField = payload.email; // ajuste conforme o nome do campo no Webflow
  const firstName = payload.firstName;
  const lastName = payload.lastName;

  if (!emailField || !firstName || !lastName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await fetch("https://YOUR_SUBDOMAIN.suitedash.com/api/v1/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SUITE_DASH_API_KEY}`
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: emailField
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || "Failed to create client" });
    }

    res.status(200).json({ success: true, client: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
   res.status(200).json({ success: true, receivedPayload: payload });
}
}
