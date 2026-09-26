// Esta función corre en el servidor (Vercel), nunca en el navegador.
// Por eso aquí SÍ es seguro usar la API key: el cliente nunca la ve.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { cvText, jobText } = req.body || {};

  if (!cvText || !jobText) {
    return res.status(400).json({ error: "Falta el CV o la oferta de empleo" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: `Eres un reclutador técnico experto. Compara el siguiente CV con la siguiente oferta de empleo.

Responde ÚNICAMENTE con un JSON válido (sin texto antes ni después, sin markdown, sin backticks) con exactamente esta forma:

{
  "matchScore": <número entero entre 0 y 100>,
  "strengths": ["punto fuerte 1", "punto fuerte 2", "..."],
  "gaps": ["carencia 1", "carencia 2", "..."],
  "suggestions": ["sugerencia concreta 1", "sugerencia concreta 2", "..."]
}

Incluye entre 3 y 5 elementos en cada lista. Sé específico y basa el análisis solo en lo que aparece en los dos textos.

--- CV ---
${cvText}

--- OFERTA DE EMPLEO ---
${jobText}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Error de la API de Anthropic:", errText);
      return res.status(502).json({ error: "Error al contactar con la IA" });
    }

    const data = await response.json();
    const rawText = data.content?.[0]?.text ?? "";
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("No se pudo parsear el JSON de la IA:", rawText);
      return res.status(502).json({ error: "La IA devolvió un formato inesperado" });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Error inesperado:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
