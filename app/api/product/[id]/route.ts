import { redis } from "@/lib/redis";
import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await axios.get(
      `https://api.keepa.com/product?key=${process.env.KEEPER_API}&domain=1&asin=${params.id}&stats=180&rating=1&buybox=1`
    );
    if (response.data.products[0].title === null) {
      return new Response(JSON.stringify({ error: "Product doesnt exist" }), {
        status: 404,
      });
    }
    //B0C9ZJHQHM
    const cachedData = await redis.get(params.id);
    if (cachedData) {
      console.log("I got the cached data");
      return new Response(cachedData, { status: 200 });
    }

    const data = JSON.stringify(response.data);
    await redis.set(params.id, data, "EX", 3600);

    return new Response(data, { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response("Error", { status: 500 });
  }
}
