# CV Matcher

Aplicación que compara un CV con una oferta de empleo usando IA, y devuelve
un porcentaje de compatibilidad, puntos fuertes, carencias y sugerencias
concretas para mejorar el CV de cara a esa oferta.

## Problema que resuelve

Adaptar un CV a cada oferta es tedioso y la mayoría de la gente no lo hace
bien: manda el mismo CV a todo. Esta herramienta automatiza ese análisis y
da feedback accionable en segundos.

## Stack técnico

- **React + Vite** — interfaz de usuario
- **Tailwind CSS** — estilos
- **pdf.js** — extracción de texto desde un PDF subido por el usuario
- **Función serverless (Vercel)** — intermediario que llama a la API de
  Claude sin exponer la API key en el navegador
- **API de Anthropic (Claude)** — analiza el CV contra la oferta y
  devuelve un JSON estructurado (score, puntos fuertes, carencias,
  sugerencias)

## Cómo correrlo en local

1. Instala dependencias:
   ```bash
   npm install
   ```

2. Instala el CLI de Vercel (para poder simular la función serverless
   en local) e inicia sesión:
   ```bash
   npm install -g vercel
   vercel login
   ```

3. Copia `.env.example` a `.env.local` y pon tu API key de
   [console.anthropic.com](https://console.anthropic.com):
   ```bash
   cp .env.example .env.local
   ```

4. En una terminal, levanta la función serverless:
   ```bash
   vercel dev
   ```

5. En otra terminal, levanta el frontend:
   ```bash
   npm run dev
   ```

6. Abre `http://localhost:5173`

## Deploy

El proyecto está pensado para desplegarse en [Vercel](https://vercel.com):
conecta el repo, y añade `ANTHROPIC_API_KEY` como variable de entorno en
la configuración del proyecto (Settings → Environment Variables).

## Estructura

```
api/analyze.js          → función serverless, llama a la API de Claude
src/App.jsx              → componente principal, orquesta el flujo
src/components/          → UI (subida de CV, input de oferta, resultado)
src/lib/extractPdfText.js → extracción de texto de PDF en el navegador
```
