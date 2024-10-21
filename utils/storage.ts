export const summarizationEnabled = storage.defineItem<boolean>(
  "sync:summarizationEnabled",
  {
    fallback: false,
  }
);
