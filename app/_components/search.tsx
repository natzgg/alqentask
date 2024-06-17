"use client";

import { useState } from "react";
import { z } from "zod";

// ASIN validation: 10-character alphanumeric string
const ASINSchema = z.string().regex(/^[A-Z0-9]{10}$/i, {
  message:
    "Invalid ASIN format. ASIN must be a 10-character alphanumeric string.",
});

// UPC validation: 12 digits (UPC-A) or 8 digits (UPC-E)
const UPCEANSchema = z
  .string()
  .regex(/^\d{12}$/, {
    message: "Invalid UPC format. UPC must be a 12-digit number.",
  })
  .or(
    z.string().regex(/^\d{8}$/, {
      message: "Invalid UPC format. UPC-E must be an 8-digit number.",
    })
  );

// EAN validation: 13 digits (EAN-13) or 8 digits (EAN-8)
const EANSchema = z
  .string()
  .regex(/^\d{13}$/, {
    message: "Invalid EAN format. EAN must be a 13-digit number.",
  })
  .or(
    z.string().regex(/^\d{8}$/, {
      message: "Invalid EAN format. EAN-8 must be an 8-digit number.",
    })
  );

// Combined schema for ASIN, UPC, and EAN
const ProductSchema = z.union([ASINSchema, UPCEANSchema, EANSchema]);

const Search = ({ onSubmit }: { onSubmit: any }) => {
  const [productId, setProductId] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      ProductSchema.parse(productId);
      setError("");
      setLoading(true);
      onSubmit(productId);
      setLoading(false);
    } catch (error: any) {
      setProductId("");
      setLoading(false);
      setError("Invalid ASIN, UPC, EAN format");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row gap-4 items-center mx-auto"
    >
      <input
        type="text"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        placeholder="ASIN"
        className="border border-black p-2"
        required
      ></input>
      <button
        type="submit"
        className="bg-purple-500 font-semibold py-1 px-2 rounded-md"
      >
        {loading ? "Loading..." : "Search"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default Search;
