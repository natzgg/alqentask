"use server";

import { Product } from "@/app/page";
import OpenAI from "openai";
import { redis } from "@/lib/redis";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API,
  dangerouslyAllowBrowser: true,
});

export async function summarizeText({
  productData,
  stock30d,
  stock90d,
  stock180d,
  salesRank,
}: {
  productData: Product | null;
  stock30d: number | undefined;
  stock90d: number | undefined;
  stock180d: number | undefined;
  salesRank: Array<number | undefined> | undefined;
}) {
  console.log("test", stock30d, stock90d, stock180d, salesRank);
  if (!productData?.asin) {
    console.log("Product ASIN is undefined or null");
    return null;
  }

  const cachedData = await redis.get(`summary_${productData?.asin}`);
  if (cachedData) {
    console.log("The summary was from cached");
    return cachedData;
  }
  if (productData?.title === null) {
    return null;
  }
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `
  Please summarize the following product data in natural language, following the structure and style of the example provided below:
  
  - Variation Count: ${productData?.variations?.length}
  - Average Rating: ${productData?.csv[16]?.[1] / 10}
  - Rating Count: ${productData?.csv[17]?.[1]}
  - Amazon In Stock Rate - 30 Days: ${stock30d}
  - Amazon In Stock Rate - 90 Days: ${stock90d}
  - Amazon In Stock Rate - 180 Days: ${stock180d}
  - Average Buy Box Price: ${
    (productData?.stats?.buyBoxStats?.[productData?.stats.buyBoxSellerId]
      ?.avgPrice ?? 0) / 100
  }
  - Sales Rank Drop (30 Days): ${salesRank?.[3]}
  - Sales Rank Drop (90 Days): ${salesRank?.[2]}
  - Sales Rank Drop (180 Days): ${salesRank?.[1]}
  - Sales Rank Drop (365 Days): ${salesRank?.[0]}
  
  Example summary:
  "Amazon has been in stock for this product more than 60% of the time over the past 90 days. The sales rank has shown a consistent pattern, maintaining a relatively low and stable position, indicating steady demand. There is no clear seasonality observed in the sales rank data. The buy box price has fluctuated moderately over the last 90 days, with noticeable variations between the FBA, FBM, and Amazon prices, suggesting competitive pricing dynamics among different sellers."
  
  Please generate the summary in the style of the example above.
  `,
      },
    ],
    max_tokens: 500,
  });

  const summary = completion.choices[0].message.content;
  if (!summary) return null;
  await redis.set(
    `summary_${productData?.asin}`,
    summary as string,
    "EX",
    3600
  );

  return summary;
}
