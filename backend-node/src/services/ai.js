export async function transformResume(resumeText) {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: `
  Convert this resume into a Japanese resume.
  
  Format:
  
  履歴書
  - 氏名 (Name)
  - 学歴 (Education)
  - 職歴 (Work Experience)
  - スキル  (Skills)
  - 志望動機 (Motivation for applying)
  
  職務経歴書
  - Detailed work experience
  
  Use formal Japanese (敬語).
  
  Below is the uploaded resume:
  ${resumeText}
        `,
        stream: false,
      }),
    });
  
    const data = await response.json();
    return data.response;
  }