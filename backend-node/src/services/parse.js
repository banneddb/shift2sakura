export function parseResume(text) {

  let cleanedText = text
    .replace(/\r\n/g, "\n")           // normalize line endings
    .replace(/\t/g, " ")              // tabs to spaces
    .replace(/[^\S\n]+/g, " ")        // collapse multiple spaces (but keep newlines)
    .replace(/\n{3,}/g, "\n\n")       // collapse 3+ blank lines into 2
    .replace(/[•·▪▸►‣⁃]/g, "- ")     // normalize bullet characters
    .trim();

    cleaned = cleaned.replace(/page\s*\d+\s*(of\s*\d+)?/gi, "");

    return cleanedText;

}