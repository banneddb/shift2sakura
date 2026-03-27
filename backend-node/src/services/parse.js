export function parseResume(resumeText) {

  const skills = [];
  const skillKeywords = ["python", "react", "java", "machine learning", "sql", "C", "C++", "next.js", "javascript"];

  skillKeywords.forEach(skill => {
    if (text.includes(skill)) {
      skills.push(skill);
    }
  });

  let company = null;
  let years = null;

  const companyMatch = text.match(/at\s([A-Z][a-zA-Z]+)/);
  if (companyMatch) company = companyMatch[1];

  const yearMatch = text.match(/(20\d{2}).*(20\d{2})/);
  if (yearMatch) years = `${yearMatch[1]}-${yearMatch[2]}`;

  return {
    skills,
    company,
    years,
    raw: text
  };
}