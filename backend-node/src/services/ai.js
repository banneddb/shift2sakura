export async function transformResume(resumeText) {

    const prompt = `
あなたは日本の就職活動専門アシスタントです。
以下の英語の履歴書を読み、日本式の履歴書に必要な情報を抽出し、日本語に翻訳してください。

【絶対ルール】
・出力はJSONのみ。説明やコメントは禁止。
・マークダウンのコードブロック（\`\`\`）は禁止。純粋なJSONだけを出力すること。
・すべての値は日本語で記入すること（英語は禁止）。
・存在しない情報は空文字 "" にすること。絶対に情報を捏造しないこと。
・学歴・職歴の年月は和暦（令和・平成・昭和）に変換すること。
・敬語（です・ます調）を使うこと。

以下のJSON形式で出力してください：

{
  "氏名": "",
  "フリガナ": "",
  "生年月日": "",
  "住所": "",
  "電話番号": "",
  "メール": "",
  "学歴": [
    { "年月": "", "内容": "" }
  ],
  "職歴": [
    { "年月": "", "内容": "" }
  ],
  "免許・資格": [
    { "年月": "", "内容": "" }
  ],
  "志望動機": "",
  "自己PR": "",
  "職務経歴書": {
    "職務要約": "",
    "職務詳細": [
      {
        "会社名": "",
        "期間": "",
        "職種": "",
        "業務内容": ""
      }
    ]
  }
}

以下は応募者の履歴書です：
${resumeText}
`;

    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama3",
            prompt,
            stream: false,
            temperature: 0.2,
            options: {
              num_predict: 2048
            }
        })

        
    });

    const data = await response.json();

    // Parse the AI's JSON response
  try {
    let cleanedResponse = data.response;
    cleanedResponse = cleanedResponse.substring(
        cleanedResponse.indexOf("{"),
        cleanedResponse.lastIndexOf("}") + 1
    );
    cleanedResponse = cleanedResponse.replace(/\/\/.*$/gm, "");
    
  // Fix unbalanced braces (AI sometimes cuts off)
  const openBraces = (cleanedResponse.match(/{/g) || []).length;
  const closeBraces = (cleanedResponse.match(/}/g) || []).length;
  for (let i = 0; i < openBraces - closeBraces; i++) {
    cleanedResponse += "}"; }

  
  const parsed = JSON.parse(cleanedResponse);
  return parsed;
} catch (e) {
    console.error("Parse error:", e.message);
    console.error("AI returned invalid JSON:", data.response);
    return { raw: data.response, error: "AI output was not valid JSON" };
}
}