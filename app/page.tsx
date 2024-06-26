"use client";

import Image from "next/image";
import Search from "./_components/search";
import { useState, useEffect } from "react";
import VisitChart from "./_components/chart";

import {
  calculateStock180,
  calculateStock30,
  calculateStock90,
  handleSummarize,
} from "@/lib/helpers";

export type Product = {
  title: string;
  features: string[];
  imagesCSV: string;
  variations: any[];
  csv: any[][];
  asin: string;
  stats: {
    buyBoxStats: Record<string, { avgPrice: number }>;
    buyBoxSellerId: string;
    outOfStockPercentage30: Array<Number>;
    outOfStockPercentage90: Array<Number>;
    salesRankDrops30: number;
    salesRankDrops90: number;
    salesRankDrops180: number;
    salesRankDrops365: number;
  };
};

export default function Home() {
  const [productData, setProductData] = useState<Product | null>(null);
  const [stock30d, setStock30d] = useState<number | undefined>(undefined);
  const [stock90d, setStock90d] = useState<number | undefined>();
  const [stock180d, setStock180d] = useState<number | undefined>();
  const [salesRank, setSalesRank] = useState<Array<number | undefined>>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/product/${productId}`);
      const data = await res.json();
      setProductData(data.products[0]);
    } catch (e) {
      setLoading(false);
      console.log("Failed to fetch product data: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productData) {
      calculateStock30(setStock30d, productData);
      calculateStock90(setStock90d, productData);
      calculateStock180(setStock180d, productData);
      getSalesRank();
    }
  }, [productData]);

  useEffect(() => {
    if (
      productData &&
      stock30d !== undefined &&
      stock90d !== undefined &&
      stock180d !== undefined &&
      salesRank.length > 0 &&
      !salesRank.includes(undefined)
    ) {
      handleSummarize(
        productData,
        stock30d,
        stock90d,
        stock180d,
        salesRank,
        setSummary
      );
    }
  }, [productData, stock30d, stock90d, stock180d, salesRank]);

  const getSalesRank = () => {
    if (productData) {
      const { stats } = productData;
      const salesRankArr = [
        stats.salesRankDrops30,
        stats.salesRankDrops90,
        stats.salesRankDrops180,
        stats.salesRankDrops365,
      ];
      setSalesRank(salesRankArr);
    }
  };

  useEffect(() => {
    if (productData) {
      getSalesRank();
    }
  }, [productData]);

  useEffect(() => {
    if (
      productData &&
      stock30d !== undefined &&
      stock90d !== undefined &&
      stock180d !== undefined &&
      salesRank.length > 0
    ) {
      handleSummarize(
        productData,
        stock30d,
        stock90d,
        stock180d,
        salesRank,
        setSummary
      );
    }
  }, [productData, stock30d, stock90d, stock180d, salesRank]);

  return (
    <div className="w-full h-screen">
      <div className="p-4">
        <div className="flex flex-col gap-4">
          <Search onSubmit={fetchProduct} />

          {/* PRODUCT INFO */}
          {loading && (
            <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-blue-600 mx-auto" />
          )}
          {productData && (
            <div className="flex flex-col gap-4 space-x-4">
              {/* PRODUCT IMAGE */}
              <div className="relative aspect-square w-full max-w-[600px] mx-auto">
                {productData.imagesCSV && (
                  <Image
                    src={`https://images-na.ssl-images-amazon.com/images/I/${
                      productData.imagesCSV.split(",")[0]
                    }`}
                    fill
                    priority
                    className="object-contain"
                    alt="img"
                  />
                )}
              </div>
              {/* PRODUCT INFO */}

              <div className="flex flex-col gap-4">
                <h1 className="font-semibold">{productData.title}</h1>
                <p className="font-semibold text-sm">
                  Variation Count: {productData.variations?.length ?? 0}
                </p>
                <p className="font-semibold text-sm">
                  Average Rating: {productData.csv[16]?.[1] / 10 ?? "N/A"}
                </p>
                <p className="font-semibold text-sm">
                  Rating Count: {productData.csv[17]?.[1] ?? "N/A"}
                </p>
                <p className="font-semibold text-sm">
                  Amazon In stock Rate - 30 Days:
                  {stock30d?.toFixed(0) ?? "N/A"}%
                </p>
                <p className="font-semibold text-sm">
                  Amazon In stock Rate - 90 Days:
                  {stock90d?.toFixed(0) ?? "N/A"}%
                </p>

                <p className="font-semibold text-sm">
                  Amazon In stock Rate - 180 Days:
                  {stock180d?.toFixed(0) ?? "N/A"}%
                </p>
                <p className="font-semibold text-sm">
                  Average Buy box price:
                  {productData.stats?.buyBoxStats?.[
                    productData.stats.buyBoxSellerId
                  ]?.avgPrice
                    ? `$${(
                        productData.stats.buyBoxStats[
                          productData.stats.buyBoxSellerId
                        ].avgPrice / 100
                      ).toFixed(2)}`
                    : "N/A"}
                </p>

                {/* BULLET LIST */}
                <ul className="list-disc flex flex-col gap-1 text-sm">
                  {productData?.features?.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
              {/* PRODUCT CHART INFO */}
              <VisitChart salesRank={salesRank} />
              {summary && (
                <div className="flex flex-col items-center gap-2">
                  <h1 className="font-semibold text-2xl">Summary</h1>
                  <p>{summary}</p>
                </div>
              )}
            </div>
          )}
          {!productData && !loading && (
            <div className="mx-auto">Product not found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
