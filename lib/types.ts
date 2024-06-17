export interface ProductData {
  title: string;
  bulletPoints: string[];
  variationCount: number;
  ratingCount: number;
  averageRating: number;
  averageBuyBoxPrice: {
    last30Days: number;
    last90Days: number;
    last180Days: number;
  };
  amazonInStockRate: {
    last30Days: number;
    last90Days: number;
    last180Days: number;
  };
  salesRankHistory: number[];
  buyBoxPriceHistory: number[];
}
