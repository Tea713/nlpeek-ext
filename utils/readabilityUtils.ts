import { Readability } from "@mozilla/readability";
import DOMPurify from "dompurify";

export async function getReadabilityContent(
  url: string
): Promise<string | null> {
  const response: Response = await fetch(url);
  if (!response.ok) {
    console.error(`Failed to fetch data. Response status: ${response.status}`);
  }

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const reader = new Readability(doc);
  const article = reader.parse();
  if (!article) {
    console.error("Fail to parse content with Readability.js.");
    return null;
  }

  const clean = DOMPurify.sanitize(article.content);
  return clean;
}
