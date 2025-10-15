// /api/webflow-to-suitedash.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const payload = req.body;

  // 🔹 Log completo do webhook do Webflow
  console.log("Recebido do Webflow:", JSON.stringify(payload, null, 2));

  // Ajuste os nomes dos campos conforme o seu formulário do Webflow
  const firstName = payload.firstName || payload["First Name"] || "";
  const lastName = payload.lastName || payload["Last Name"] || "";
  const email = payload.email || payload.Email || "";

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 🔹 Chamada à API do SuiteDash
    const suiteDashRes = await fetch("https://app.suitedash.com/secure-api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `SuiteDash-API ${process.env.SUITE_DASH_PUBLIC_ID}:${process.env.SUITE_DASH_SECRET_KEY}`
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email
      })
    });

    const data = await suiteDashRes.json();

    if (!suiteDashRes.ok) {
      console.error("Erro SuiteDash:", data);
      return res.status(suiteDashRes.status).json({ error: data.message || "Failed to create client" });
    }

    // 🔹 Retorna sucesso
    res.status(200).json({ success: true, client: data });
  } catch (err) {
    console.error("Erro interno:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
