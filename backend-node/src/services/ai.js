export async function transformResume(resumeData) {

    const prompt = `
    あなたは日本の就職活動専門の履歴書作成アシスタントです。
    
    以下のデータをもとに、日本式の履歴書と職務経歴書を作成してください。
    
    【絶対ルール】
    ・出力は日本語のみ
    ・英語は禁止
    ・説明やコメントは禁止
    ・プレースホルダーは禁止（例：[Your Name] など）
    ・必ず以下のフォーマットを守ること
    
    ーーーーーーーーーーーーーー
    
    履歴書
    
    氏名：
    学歴：
    職歴：
    スキル：
    志望動機：
    
    ーーーーーーーーーーーーーー
    
    職務経歴書
    
    （職務内容を丁寧な文章で詳しく書く）
    
    ーーーーーーーーーーーーーー
    
    データ(JSON形式):
    ${resumeData}

    JSONの情報のみを使って履歴書を書いてください。
    存在しない情報は絶対に作らないでください。    `;
    
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3",
          prompt,
          stream: false,
          temperature: 0.2
        })
      });
    
      const data = await response.json();
      return data.response;
    }