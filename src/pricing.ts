import { fromEntries, groupBy, mapValues } from "remeda";

type EncodingName =
  | "cl100k_base"
  | "p50k_base"
  | "r50k_base"
  | "p50k_edit"
  | "o200k_base";

interface PricingByModel {
  [modelName: string]: {
    humanName: string;
    description: string;
    regular: {
      /** input cost per million tokens */
      input: number;
      /** output cost per million tokens */
      output: number;
    };
    batchApi: {
      /** input cost per million tokens */
      input: number | null;
      /** output cost per million tokens */
      output: number | null;
    };
    encoding: EncodingName;
  };
}

const pricing = {
  "gpt-4o": {
    humanName: "GPT-4o",
    description: "GPT-4o is an advanced multimodal model with 128K context.",
    regular: {
      input: 5.0,
      output: 15.0,
    },
    batchApi: {
      input: 2.5,
      output: 7.5,
    },
    encoding: "o200k_base",
  },
  "gpt-4o-2024-08-06": {
    humanName: "GPT-4o (Aug 2024)",
    description: "A more recent version of GPT-4o, optimized for efficiency.",
    regular: {
      input: 2.5,
      output: 10.0,
    },
    batchApi: {
      input: 1.25,
      output: 5.0,
    },
    encoding: "o200k_base",
  },
  "gpt-4o-2024-05-13": {
    humanName: "GPT-4o (May 2024)",
    description: "An earlier version of GPT-4o with strong capabilities.",
    regular: {
      input: 5.0,
      output: 15.0,
    },
    batchApi: {
      input: 2.5,
      output: 7.5,
    },
    encoding: "o200k_base",
  },
  "gpt-4o-mini": {
    humanName: "GPT-4o Mini",
    description:
      "Cost-efficient, small version of GPT-4o optimized for simpler tasks.",
    regular: {
      input: 0.15,
      output: 0.6,
    },
    batchApi: {
      input: 0.075,
      output: 0.3,
    },
    encoding: "o200k_base",
  },
  "gpt-4o-mini-2024-07-18": {
    humanName: "GPT-4o Mini (Jul 2024)",
    description:
      "A recent version of GPT-4o Mini optimized for cost-efficiency.",
    regular: {
      input: 0.15,
      output: 0.6,
    },
    batchApi: {
      input: 0.075,
      output: 0.3,
    },
    encoding: "o200k_base",
  },
  "o1-preview": {
    humanName: "OpenAI o1-preview",
    description: "Reasoning model for complex tasks with 128K context.",
    regular: {
      input: 15.0,
      output: 60.0,
    },
    batchApi: {
      input: null,
      output: null,
    },
    encoding: "o200k_base",
  },
  "o1-mini": {
    humanName: "OpenAI o1-mini",
    description:
      "Fast and cost-efficient reasoning model tailored for coding and math.",
    regular: {
      input: 3.0,
      output: 12.0,
    },
    batchApi: {
      input: null,
      output: null,
    },
    encoding: "o200k_base",
  },
  "text-embedding-3-small": {
    humanName: "Text Embedding 3 Small",
    description: "Embedding model for small-scale applications.",
    regular: {
      input: 0.02,
      output: 0,
    },
    batchApi: {
      input: 0.01,
      output: 0,
    },
    encoding: "cl100k_base",
  },
  "text-embedding-3-large": {
    humanName: "Text Embedding 3 Large",
    description: "Embedding model for large-scale applications.",
    regular: {
      input: 0.13,
      output: 0,
    },
    batchApi: {
      input: 0.065,
      output: 0,
    },
    encoding: "cl100k_base",
  },
  "ada-v2": {
    humanName: "Ada v2",
    description:
      "A versatile model suitable for text embeddings and lightweight NLP tasks.",
    regular: {
      input: 0.1,
      output: 0,
    },
    batchApi: {
      input: 0.05,
      output: 0,
    },
    encoding: "r50k_base",
  },
  "gpt-4o-2024-08-06-finetune": {
    humanName: "GPT-4o 2024-08-06 Finetuning",
    description: "GPT-4o finetuned for custom tasks.",
    regular: {
      input: 3.75,
      output: 15.0,
    },
    batchApi: {
      input: 1.875,
      output: 7.5,
    },
    encoding: "o200k_base",
  },
  "gpt-4o-mini-2024-07-18-finetune": {
    humanName: "GPT-4o Mini 2024-07-18 Finetuning",
    description: "GPT-4o mini finetuned for custom tasks.",
    regular: {
      input: 0.3,
      output: 1.2,
    },
    batchApi: {
      input: 0.15,
      output: 0.6,
    },
    encoding: "o200k_base",
  },
  "gpt-4o-mini-training": {
    humanName: "GPT-4o Mini Training",
    description: "Training GPT-4o Mini with custom datasets.",
    regular: {
      input: 3.0,
      output: 0,
    },
    batchApi: {
      input: 1.5,
      output: 0,
    },
    encoding: "o200k_base",
  },
  "gpt-3.5-turbo-finetune": {
    humanName: "GPT-3.5 Turbo Finetuning",
    description: "Finetuning GPT-3.5 Turbo with custom data.",
    regular: {
      input: 3.0,
      output: 6.0,
    },
    batchApi: {
      input: 1.5,
      output: 3.0,
    },
    encoding: "cl100k_base",
  },
  "gpt-4o-mini-training-2024-07-18": {
    humanName: "GPT-4o Mini Training 2024-07-18",
    description: "Finetuning GPT-4o Mini with specific date.",
    regular: {
      input: 3.0,
      output: 0,
    },
    batchApi: {
      input: 1.5,
      output: 0,
    },
    encoding: "o200k_base",
  },
  "gpt-4-32k": {
    humanName: "GPT-4 32k",
    description: "GPT-4 model with 32k token context.",
    regular: {
      input: 60.0,
      output: 120.0,
    },
    batchApi: {
      input: 30.0,
      output: 60.0,
    },
    encoding: "cl100k_base",
  },
  "gpt-3.5-turbo-16k": {
    humanName: "GPT-3.5 Turbo 16k",
    description: "GPT-3.5 model with 16k token context.",
    regular: {
      input: 3.0,
      output: 4.0,
    },
    batchApi: {
      input: 1.5,
      output: 2.0,
    },
    encoding: "cl100k_base",
  },
  "gpt-3.5-turbo-0301": {
    humanName: "GPT-3.5 Turbo 0301",
    description: "Earlier version of GPT-3.5 Turbo.",
    regular: {
      input: 1.5,
      output: 2.0,
    },
    batchApi: {
      input: 0.75,
      output: 1.0,
    },
    encoding: "cl100k_base",
  },
  "gpt-4-turbo": {
    humanName: "GPT-4 Turbo",
    description: "Faster and more cost-efficient version of GPT-4.",
    regular: {
      input: 10.0,
      output: 30.0,
    },
    batchApi: {
      input: 5.0,
      output: 15.0,
    },
    encoding: "cl100k_base",
  },
  "chatgpt-4o-latest": {
    humanName: "ChatGPT 4o Latest",
    description: "Latest version of ChatGPT 4o.",
    regular: {
      input: 5.0,
      output: 15.0,
    },
    batchApi: {
      input: 2.5,
      output: 7.5,
    },
    encoding: "o200k_base",
  },
  "gpt-4-turbo-2024-04-09": {
    humanName: "GPT-4 Turbo 2024-04-09",
    description: "Updated version of GPT-4 Turbo.",
    regular: {
      input: 10.0,
      output: 30.0,
    },
    batchApi: {
      input: 5.0,
      output: 15.0,
    },
    encoding: "cl100k_base",
  },
  "gpt-4": {
    humanName: "GPT-4",
    description: "Standard version of GPT-4.",
    regular: {
      input: 30.0,
      output: 60.0,
    },
    batchApi: {
      input: 15.0,
      output: 30.0,
    },
    encoding: "cl100k_base",
  },
  "gpt-4-0125-preview": {
    humanName: "GPT-4 0125 Preview",
    description: "Preview version of GPT-4.",
    regular: {
      input: 10.0,
      output: 30.0,
    },
    batchApi: {
      input: 5.0,
      output: 15.0,
    },
    encoding: "cl100k_base",
  },
  "gpt-4-1106-preview": {
    humanName: "GPT-4 1106 Preview",
    description: "Another preview version of GPT-4.",
    regular: {
      input: 10.0,
      output: 30.0,
    },
    batchApi: {
      input: 5.0,
      output: 15.0,
    },
    encoding: "cl100k_base",
  },
  "gpt-4-vision-preview": {
    humanName: "GPT-4 Vision Preview",
    description: "Vision capabilities preview of GPT-4.",
    regular: {
      input: 10.0,
      output: 30.0,
    },
    batchApi: {
      input: 5.0,
      output: 15.0,
    },
    encoding: "cl100k_base",
  },
  "gpt-3.5-turbo-0125": {
    humanName: "GPT-3.5 Turbo 0125",
    description: "Preview version of GPT-3.5 Turbo.",
    regular: {
      input: 0.5,
      output: 1.5,
    },
    batchApi: {
      input: 0.25,
      output: 0.75,
    },
    encoding: "cl100k_base",
  },
  "gpt-3.5-turbo-instruct": {
    humanName: "GPT-3.5 Turbo Instruct",
    description: "Instruction-tuned version of GPT-3.5 Turbo.",
    regular: {
      input: 1.5,
      output: 2.0,
    },
    batchApi: {
      input: 0.75,
      output: 1.0,
    },
    encoding: "cl100k_base",
  },
  "gpt-3.5-turbo-1106": {
    humanName: "GPT-3.5 Turbo 1106",
    description: "Another variant of GPT-3.5 Turbo.",
    regular: {
      input: 1.0,
      output: 2.0,
    },
    batchApi: {
      input: 0.5,
      output: 1.0,
    },
    encoding: "cl100k_base",
  },
  "gpt-3.5-turbo-0613": {
    humanName: "GPT-3.5 Turbo 0613",
    description: "Version of GPT-3.5 Turbo from June 2013.",
    regular: {
      input: 1.5,
      output: 2.0,
    },
    batchApi: {
      input: 0.75,
      output: 1.0,
    },
    encoding: "cl100k_base",
  },
  "gpt-3.5-turbo-16k-0613": {
    humanName: "GPT-3.5 Turbo 16k 0613",
    description: "16k context version from June 2013.",
    regular: {
      input: 3.0,
      output: 4.0,
    },
    batchApi: {
      input: 1.5,
      output: 2.0,
    },
    encoding: "cl100k_base",
  },
  "davinci-002": {
    humanName: "Davinci 002",
    description: "Legacy model with high performance.",
    regular: {
      input: 2.0,
      output: 2.0,
    },
    batchApi: {
      input: 1.0,
      output: 1.0,
    },
    encoding: "p50k_base",
  },
  "babbage-002": {
    humanName: "Babbage 002",
    description: "A smaller model for efficient processing.",
    regular: {
      input: 0.4,
      output: 0.4,
    },
    batchApi: {
      input: 0.2,
      output: 0.2,
    },
    encoding: "p50k_base",
  },
} satisfies PricingByModel;

type PricingByModelByEncoding = Record<EncodingName, PricingByModel>;

const groupByEncoding = groupBy(
  Object.entries(pricing),
  ([, { encoding }]) => encoding,
);

export const pricingByEncoding = mapValues(groupByEncoding, (entries) =>
  fromEntries(entries),
) as PricingByModelByEncoding;
