export async function giveAdvice(resumeJSON, jobDescription, field, question) {
  const prompt = `
You are helping a foreign applicant fill out a Japanese resume (rirekisho).

They need to answer this specific field: "${field}" — "${question}"

Here is what we know about them from their resume:
${JSON.stringify(resumeJSON, null, 2)}

Here is the job description they are applying for:
${jobDescription}

Give 2-3 short bullet points advising what they should mention in their answer to "${question}".

Rules:
- English only
- Output bullet points only, no intro or outro text
- Be specific to their background and this job posting
- Each bullet point should start with "•"
`

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      prompt,
      stream: false,
      temperature: 0.4,
      options: { num_predict: 512 }
    })
  });

  const data = await response.json();
  
  // Split on bullet points and clean up into an array
  return data.response
    .trim()
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.startsWith("•"));
}