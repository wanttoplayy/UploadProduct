"use client";

import { useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import { Poppins, Prompt } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
});

const poppins600 = Poppins({
  subsets: ["latin"],
  weight: "600",
  style: "normal",
});

const prompt = Prompt({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
});

type Product = {
  _id: string;
  name: string;
  code: string;
  price: number;
  imageUrl: string;
};

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Error fetching products");
  }
  return res.json();
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error } = useSWR(`/api/product?search=${searchTerm}`, fetcher);

  if (error) return <div>Failed to load products</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="container flex flex-col py-[96px] px-[99px]  bg-white ">
      <div className="text-[#252525] text-[32px] " style={poppins600.style}>
        Product list
      </div>
      <input
        type="text"
        placeholder="Search by name or code..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="rounded-full border my-8 border-gray-300 bg-white h-14 px-5 w-full"
        style={{ borderColor: "#D9D9D9" }}
      />

      <div className="grid grid-cols-4 gap-4">
        {/* Map through your products and render cards */}
        {data.products.map((product: Product) => (
          <div
            key={product._id}
            className="bg-white shadow-md rounded-lg w-[200px] h-[335px] flex-shrink-0 "
          >
            <Image
              width={200}
              height={200}
              src={product.imageUrl}
              alt={product.name}
              className="rounded-t-lg w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold">{product.name}</h3>
              <p>{product.code}</p>
              <p className="text-red-500">฿{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
