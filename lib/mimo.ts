import OpenAI from "openai";

function getMimo() {
  return new OpenAI({
    apiKey: process.env.MIMO_API_KEY,
    baseURL: process.env.MIMO_API_BASE,
  });
}

export async function generateContent(
  keyword: string,
  type: "article" | "meta" | "titles",
  language: string,
  length: "short" | "medium" | "long"
) {
  const prompts: Record<string, string> = {
    article: `Write a comprehensive SEO-optimized article about "${keyword}".
Requirements:
- Use H2 and H3 headings with the keyword naturally included
- Write in ${language}
- Length: ${length === "short" ? "500-800" : length === "medium" ? "1000-1500" : "2000-2500"} words
- Include a meta description (under 160 characters)
- Use bullet points and numbered lists where appropriate
- Include internal linking suggestions
- Write in a natural, engaging tone
- Optimize for search intent

Output format: Return the article in Markdown format.`,

    meta: `Generate SEO meta tags for the keyword "${keyword}".
Requirements:
- Write in ${language}
- Generate 5 variations of title tags (under 60 characters each)
- Generate 5 variations of meta descriptions (under 160 characters each)
- Include the keyword naturally
- Make them compelling and click-worthy
- Each variation should use a different angle (question, number, emotional, benefit, urgency)

Output format: Return in Markdown with clear sections for titles and descriptions.`,

    titles: `Generate SEO-optimized title ideas for "${keyword}".
Requirements:
- Write in ${language}
- Generate 20 title ideas
- Mix of formats: listicles, how-to, questions, guides, comparisons
- Include power words and emotional triggers
- Each title should be under 60 characters for SEO
- Group by category

Output format: Return in Markdown with categorized sections.`,
  };

  const mimo = getMimo();

  const response = await mimo.chat.completions.create({
    model: "mimo-v2-pro",
    messages: [
      {
        role: "system",
        content:
          "You are an expert SEO content writer. Create high-quality, SEO-optimized content that ranks well on search engines. Always follow the specific requirements provided.",
      },
      { role: "user", content: prompts[type] },
    ],
    temperature: 0.7,
    max_tokens: length === "short" ? 2000 : length === "medium" ? 4000 : 6000,
  });

  return response.choices[0]?.message?.content || "Generation failed. Please try again.";
}
