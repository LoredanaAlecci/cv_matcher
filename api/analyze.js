// Esta función corre en el servidor (Vercel), nunca en el navegador.
// Por eso aquí SÍ es seguro usar la API key: el cliente nunca la ve.
//
// Usa la API de Gemini (Google AI Studio): tiene tier gratuito real,
// sin tarjeta de crédito. Consigue tu key gratis en https://aistudio.google.com/apikey

const GEMINI_MODEL = "gemini-1.5-flash";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { cvText, jobText } = req.body || {};

  if (!cvText || !jobText) {
    return res.status(400).json({ error: "Falta el CV o la oferta de empleo" });
  }

  const prompt = `Eres un reclutador técnico experto. Compara el siguiente CV con la siguiente oferta de empleo.

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
${jobText}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Error de la API de Gemini:", errText);
      return res.status(502).json({ error: "Error al contactar con la IA" });
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let parsed;
    try {
      parsed = JSON.parse(rawText);
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