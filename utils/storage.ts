export const summarizationEnabled = storage.defineItem<boolean>(
  "sync:summarizationEnabled",
  {
    fallback: false,
  }
);

export const currentSummaryLength = storage.defineItem<string>(
  "sync:currentSummaryLength",
  {
    fallback: "medium",
  }
);

export const currentHoverInDelay = storage.defineItem<number>(
  "sync:currentHoverInDelay",
  {
    fallback: 500,
  }
);

export const currentHoverOutDelay = storage.defineItem<number>(
  "sync:currentHoverOutDelay",
  {
    fallback: 500,
  }
);

interface Summary {
  summaryText: string;
  timestamp: number;
}

export const cachedSummaries = storage.defineItem<Record<string, Summary>>(
  "local:cachedSummaries",
  {
    fallback: {},
  }
);
