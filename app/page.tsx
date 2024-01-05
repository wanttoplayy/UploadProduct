"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import Image from "next/image";
import { Poppins, Prompt } from "next/font/google";
import Link from "next/link";
import debounce from "lodash.debounce";

import { Button } from "@/components/ui/button";

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
  weight: "600",
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const { data, error } = useSWR(
    `/api/product?search=${debouncedSearchTerm}`,
    fetcher
  );

  const debounceSearchTerm = debounce((value) => {
    setDebouncedSearchTerm(value);
  }, 1500); // 500ms delay

  useEffect(() => {
    return () => {
      debounceSearchTerm.cancel(); // Cancel the debounce on unmount
    };
  }, []);

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
    debounceSearchTerm(event.target.value);
  };

  if (error) return <div>Failed to load products</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="mainComponent">
      <div className="text-[#252525] text-[32px] " style={poppins600.style}>
        Product list
      </div>
      <input
        type="text"
        placeholder="Search by name or code..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="rounded-full border mt-8 lg:m-8 border-gray-300 bg-white h-14 px-5 w-full"
        style={{ borderColor: "#D9D9D9" }}
      />

      <div className="grid grid-cols-5 max-lg:grid-cols-2  gap-4">
        {data.products.map((product: Product) => (
          <Link key={product._id} href={`/product/${product._id}`}>
            <div key={product._id} className="card shadow-xsurface">
              <Image
                width={200}
                height={200}
                src={product.imageUrl}
                alt={product.name}
                className="card-image"
              />
              <div className="px-4 pt-4 flex-1">
                <div
                  className="text-[16px] text-[#252525]"
                  style={poppins600.style}
                >
                  {product.name}
                </div>
                <div
                  className="text-[12px] text-[#6C6C70]"
                  style={poppins.style}
                >
                  {product.code}
                </div>
              </div>
              <div className="px-4 pb-4 text-right">
                <div
                  className="text-[20px] text-[#E13B30]"
                  style={prompt.style}
                >
                  ฿{product.price}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <Button className="bg-red-500 text-white py-2 px-4 rounded-lg">
          <Link href="/upload" style={prompt.style}>
            Product Page
          </Link>
        </Button>
      </div>
    </div>
  );
}
