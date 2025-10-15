// /api/webflow-to-suitedash.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const payload = req.body;

  console.log("Recebido do Webflow:", JSON.stringify(payload, null, 2));

  // 🔹 Campos do Webflow
  const fullName = payload.data?.Name || "";
  const email = payload.data?.Email || "";


  if (!fullName || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // 🔹 Separar primeiro e último nome
  const nameParts = fullName.trim().split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || "N/A";

  try {
    // 🔹 Criar contato no SuiteDash
    const suiteDashRes = await fetch("https://app.suitedash.com/secure-api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Public-ID": process.env.SUITE_DASH_PUBLIC_ID,
        "X-Secret-Key": process.env.SUITE_DASH_SECRET_KEY
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email,
        role: "Client"
      })
    });

    const data = await suiteDashRes.json();

    if (!suiteDashRes.ok) {
      console.error("Erro SuiteDash:", data);
      return res.status(suiteDashRes.status).json({ error: data.message || "Failed to create contact" });
    }

    res.status(200).json({ success: true, client: data });
  } catch (err) {
    console.error("Erro interno:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
