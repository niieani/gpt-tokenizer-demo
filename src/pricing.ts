import { models, type Model } from "gpt-tokenizer/models";
import { fromEntries, groupBy, mapValues } from "remeda";

const groupByEncoding = groupBy(
  Object.entries(models),
  ([, { encoding }]) => encoding,
);

// Helper to deduplicate by humanName
const deduplicateByHumanName = (entries: [string, Model][]) => {
  const seen = new Set();
  return entries.filter(([, model]) => {
    if (seen.has(model.humanName)) {
      return false;
    }
    seen.add(model.humanName);
    return true;
  });
};

export const modelsByEncoding = mapValues(groupByEncoding, (entries) =>
  fromEntries(deduplicateByHumanName(entries)),
);
