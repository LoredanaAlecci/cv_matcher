import * as pdfjsLib from "pdfjs-dist";

// Cargamos el worker desde un CDN usando la versión exacta instalada,
// en vez de importarlo del paquete local: evita problemas de resolución
// de rutas con Vite que varían según la versión de pdfjs-dist.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Recibe un File (del <input type="file">) y devuelve el texto plano.
export async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return text.trim();
}
