import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export async function extractTextFromPDF(pdfBuffer) {
    const data = await pdfParse(pdfBuffer);
    return data.text; // <--- Raw, unstructured string
}