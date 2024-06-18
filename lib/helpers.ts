import { Product } from "@/app/page";
import { summarizeText } from "@/lib/openai";

export const calculateStock30 = (
  setStock30d: any,
  productData: Product | null
) => {
  const filtered = productData?.stats.outOfStockPercentage30.filter(
    (num: any): num is number => num !== -1 && typeof num === "number"
  );

  // Calculate the average
  const total =
    filtered?.reduce((acc: number, num: number) => acc + num, 0) || 0;
  const count = filtered?.length || 1; // Avoid division by zero
  const average = total / count;

  setStock30d(100 - average);
};

export const calculateStock90 = (
  setStock90d: any,
  productData: Product | null
) => {
  const filtered = productData?.stats.outOfStockPercentage90.filter(
    (num: any): num is number => num !== -1 && typeof num === "number"
  );

  // Calculate the average
  const total =
    filtered?.reduce((acc: number, num: number) => acc + num, 0) || 0;
  const count = filtered?.length || 1; // Avoid division by zero
  const average = total / count;

  setStock90d(100 - average);
};

export const calculateStock180 = (
  setStock180d: any,
  productData: Product | null
) => {
  const filtered = productData?.stats.outOfStockPercentage30.filter(
    (num: any): num is number => num !== -1 && typeof num === "number"
  );

  // Calculate the average
  const total =
    filtered?.reduce((acc: number, num: number) => acc + num, 0) || 0;
  const count = filtered?.length || 1; // Avoid division by zero
  const average = total / count;

  setStock180d(100 - average);
};

export const handleSummarize = async (
  productData: Product | null,
  stock30d: number | undefined,
  stock90d: number | undefined,
  stock180d: number | undefined,
  salesRank: Array<number | undefined> | undefined,
  setSummary: any
) => {
  try {
    const result = await summarizeText({
      productData,
      stock30d,
      stock90d,
      stock180d,
      salesRank,
    });
    setSummary(result); // Update state with the summary returned from summarizeText
  } catch (error) {
    console.error("Error summarizing text:", error);
    setSummary(null); // Handle error case by setting summary to null or handle differently as needed
  }
};
