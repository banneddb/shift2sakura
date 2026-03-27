import pdfParse from "pdf";

export async function extractTextFromPDF(pdfBuffer) {
    const data = await pdfParse(pdfBuffer);
    return data.text; // <--- Raw string
}