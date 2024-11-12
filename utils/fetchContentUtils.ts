import { getSummary } from "@/service/summarizationService";
import { getReadabilityContent } from "@/utils/readabilityUtils";
import { getCachedSummary, setCachedSummary } from "@/utils/cache";

export async function fetchTooltipContent(
  url: string,
  anchorText: string,
  summaryLength: string
): Promise<{ title: string; content: string }> {
  try {
    const readabilityContent = await getReadabilityContent(url);
    if (!readabilityContent) {
      return {
        title: anchorText,
        content: "Error fetching content.",
      };
    }

    const cached = await getCachedSummary(url, summaryLength);
    if (cached) {
      return {
        title: readabilityContent.title,
        content: cached,
      };
    }

    const summarizedContent = await getSummary(
      readabilityContent.content,
      summaryLength
    );
    if (!summarizedContent) {
      return {
        title: readabilityContent.title,
        content: "Error summarizing content.",
      };
    }

    await setCachedSummary(url, summaryLength, summarizedContent);
    return {
      title: readabilityContent.title,
      content: summarizedContent,
    };
  } catch (error) {
    console.error(`Error: ${error}`);
    return {
      title: anchorText,
      content: "Error fetching summary.",
    };
  }
}
