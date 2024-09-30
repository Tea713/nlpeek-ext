import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import createDOMPurify from "dompurify";

export default defineBackground(() => {
  async function fetchContent(
    url: string
  ): Promise<{ title: string; content: string } | { error: string }> {
    try {
      const response: Response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data. Response status: ${response.status}`
        );
      }
      const html = await response.text();
      
      const dom = new JSDOM(html, { url });
      const reader = new Readability(dom.window.document);
      const article = reader.parse();
      if (article) {
        const window = new JSDOM("").window;
        const DOMPurify = createDOMPurify(window);
        const clean = DOMPurify.sanitize(article.content);

        return {
          title: article.title,
          content: clean,
        };
      } else {
        return { error: "Failed to parse content" };
      }
    } catch (error: any) {
      if (error instanceof Error) {
        console.error(`Error fetching data from ${url}`);
      } else {
        console.error(`Unknown error fetching data from ${url}`);
      }
      return { error: "Error fetching or parsing URL" };
    }
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action == "fetch-content") {
      fetchContent(message.url)
        .then(
          (
            extractedContent:
              | { title: string; content: string }
              | { error: string }
          ) => {
            sendResponse({ extractedContent });
          }
        )
        .catch((error: any) => {
          console.error(error);
          return { error: "Error fetching extracted content" };
        });
    }
  });
});
