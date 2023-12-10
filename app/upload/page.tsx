"use client";
import { useState, useCallback, ChangeEvent, FormEvent } from "react";
import { useDropzone } from "react-dropzone";
import { Inter, Poppins } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: "400", // Specify the weight you need
  style: "normal", // Specify the style you need
  variable: "--font-poppins", // Define a CSS variable for the font
});

type Product = {
  name: string;
  code: string;
  price: number;
};

const ProductUpload = () => {
  const [product, setProduct] = useState<Product>({
    name: "",
    code: "",
    price: 0,
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/svg+xml": [],
    },
    maxFiles: 1,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setProduct({
      ...product,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      console.error("File is not selected.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", product.name);
    formData.append("code", product.code);
    formData.append("price", product.price.toString());

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Product uploaded:", data);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading product:", error);
      setUploading(false);
    }
  };

  return (
    <main className={poppins.className}>
      <div className="container mx-auto p-8 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-start">Upload Product</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            {...getRootProps()}
            className="border-dashed border-2 border-gray-300 rounded-md text-center py-10 cursor-pointer"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the file here...</p>
            ) : (
              <p>Drag 'n' drop some file here, or click to select file</p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
              className="border-gray-300 focus:ring-violet-500 focus:border-violet-500 block w-full shadow-sm sm:text-sm border-2 rounded-md p-2"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Code
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={product.code}
              onChange={handleChange}
              required
              className="border-gray-300 focus:ring-violet-500 focus:border-violet-500 block w-full shadow-sm sm:text-sm border-2 rounded-md p-2"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
              className="border-gray-300 focus:ring-violet-500 focus:border-violet-500 block w-full shadow-sm sm:text-sm border-2 rounded-md p-2"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              uploading ? "bg-gray-300" : "bg-red-500 hover:bg-red-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default ProductUpload;
