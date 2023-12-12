"use client";
import { useState, useEffect } from "react";

type ParamsType = {
  productId: string;
};

// Use this type in your component props
type ProductDetailPageProps = {
  params: ParamsType;
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productId } = params;

  const [product, setProduct] = useState({
    name: "",
    code: "",
    price: "",
    imageUrl: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/${productId}`);
        const data = await response.json();
        if (data.success) {
          setProduct(data.data);
        } else {
          console.error("Failed to load product data");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/product/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      if (data.success) {
        alert("Product updated successfully");
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/product/${productId}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (data.success) {
          alert("Product deleted successfully");
          // Redirect to home page or another page
        } else {
          alert("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-5">Edit Product</h1>

        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          name="name"
        />

        <label
          className="block text-gray-700 text-sm font-bold mb-2 mt-4"
          htmlFor="code"
        >
          Code
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="code"
          type="text"
          placeholder="Product Code"
          value={product.code}
          onChange={handleChange}
          name="code"
        />

        <label
          className="block text-gray-700 text-sm font-bold mb-2 mt-4"
          htmlFor="price"
        >
          Price
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="price"
          type="text"
          placeholder="Product Price"
          value={product.price}
          onChange={handleChange}
          name="price"
        />

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          type="button"
          onClick={handleUpdate}
        >
          Update Product
        </button>

        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          type="button"
          onClick={handleDelete}
        >
          Delete Product
        </button>
      </div>
    </div>
  );
}
