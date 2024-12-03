import { Readability, isProbablyReaderable } from "@mozilla/readability";
import DOMPurify from "dompurify";

export async function getReadabilityContent(url: string): Promise<{
  title: string;
  content: string;
} | null> {
  const response: Response = await fetch(url);
  if (!response.ok) {
    console.error(`Failed to fetch data. Response status: ${response.status}`);
    return null;
  }

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  if (isProbablyReaderable(doc)) {
    const reader = new Readability(doc);
    const article = reader.parse();
    if (!article) {
      console.error("Fail to parse content with Readability.js.");
      return null;
    }

    const clean = DOMPurify.sanitize(article.content);
    return { title: article.title, content: clean };
  } else {
    const clean = DOMPurify.sanitize(html);
    return { title: doc.title, content: clean };
  }
}
