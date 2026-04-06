import { extractTextFromPDF } from "../services/extractText.js";
import { transformResume } from "../services/ai.js";
import { parseResume } from "../services/cleanExtractedText.js";
import { giveAdvice } from "../services/generateAdvice.js";

export async function extractAndClean(req, res, next) {
  if (!req.file) return res.status(400).json({ error: "No resume detected!" });

  const jobDescription = req.body.jobDescription || "";

  try {
    const resumeText = await extractTextFromPDF(req.file.buffer);
    const cleaned = parseResume(resumeText);
    const result = await transformResume(cleaned);

    if (result.error) return res.status(422).json(result);

    const missingFields = [];
    if (!result.氏名) missingFields.push({ field: "氏名", question: "What is your full name?" });
    if (!result.フリガナ) missingFields.push({ field: "フリガナ", question: "What is the katakana reading of your name?" });
    if (!result.生年月日) missingFields.push({ field: "生年月日", question: "What is your date of birth?" });
    if (!result.住所) missingFields.push({ field: "住所", question: "What is your address in Japan?" });
    if (!result.電話番号) missingFields.push({ field: "電話番号", question: "What is your phone number?" });
    if (!result.メール) missingFields.push({ field: "メール", question: "What is your email address?" });
    if (!result.志望動機) missingFields.push({ field: "志望動機", question: "Why are you applying for this position?" });
    if (!result.自己PR) missingFields.push({ field: "自己PR", question: "Describe your strengths and what you bring to the role." });

    // Only generate advice if a job description was provided
    // Build a map of promises so that the AI can generate all advice in one go
    if (jobDescription) {
      await Promise.all(
        missingFields.map(async (field) => {
          field.advice = await giveAdvice(result, jobDescription, field.field, field.question);
        })
      );
    }

    res.json({ result, missingFields });

  } catch (err) {
    next(err);
  }
}