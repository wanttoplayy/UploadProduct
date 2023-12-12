"use client";
import { useState, useCallback, ChangeEvent, FormEvent } from "react";
import { useDropzone } from "react-dropzone";
import { Poppins, Prompt } from "next/font/google";
import Image from "next/image";

import UploadIcon from "@/app/assets/images/uploadIcon.png";

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
  name: string;
  code: string;
  price: string;
};

const ProductUpload = () => {
  const [product, setProduct] = useState<Product>({
    name: "",
    code: "",
    price: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedImagesCount, setUploadedImagesCount] = useState(0);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Assuming you want to allow a maximum of 6 images
      if (acceptedFiles.length + uploadedImagesCount <= 6) {
        setFile(acceptedFiles[0]); // If you're uploading one by one
        setUploadedImagesCount(uploadedImagesCount + acceptedFiles.length);
      } else {
        // Handle the case where the limit is exceeded
        console.error("You can upload a maximum of 6 images.");
      }
    },
    [uploadedImagesCount]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/svg+xml": [],
    },
    maxFiles: 6,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const updatedValue =
      type === "number" ? (value ? parseFloat(value) : "") : value;
    setProduct({ ...product, [name]: updatedValue });

    // Log the updated product state
    console.log("Updated product:", { ...product, [name]: updatedValue });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else {
      console.error("No file selected");
      return;
    }

    try {
      const uploadResponse = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.fileName; // Updated to use fileName from the response

      console.log("Image URL:", imageUrl); // Log the image URL

      // Send the product details including the image URL to your product API
      const productResponse = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: product.name,
          code: product.code,
          price: product.price,
          imageUrl: imageUrl, // Send the imageUrl obtained from the s3 upload response
        }),
      });
      const productData = await productResponse.json();
      console.log("Product created:", productData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className={poppins.className}>
      <div className="container mx-auto p-8 bg-white shadow rounded-lg">
        <h1
          className={`${poppins600.className} text-[32px] font-bold mb-6 text-start ml-[5%]`}
        >
          Upload Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4  flex flex-col items-center align-middle  h-full"
        >
          <div className="relative w-[924px]">
            <div
              {...getRootProps()}
              className="flex flex-col items-center justify-center border-dashed border-2 border-gray-300 rounded-3xl text-center p-10 cursor-pointer w-[924px] h-[350px]"
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* Image */}
                <Image
                  src={UploadIcon}
                  alt="Upload icon"
                  width={26}
                  height={27}
                />

                {/* Drag & Drop Text */}
                {isDragActive ? (
                  <p className="text-sm font-medium text-[#6C6C70]">
                    Drop the file here...
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-[#6C6C70]">
                      Drag & Drop or{" "}
                      <span className="text-blue-600">Choose file</span> to
                      upload
                    </p>
                    <p className="text-xs text-[#6C6C70]">
                      JPG. or PNG Maximum file size 50MB
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="absolute mt-2 bottom-[-20] right-2">
              <p className="text-xs text-[#6C6C70]">
                Image upload ({uploadedImagesCount}/6)
              </p>
            </div>
          </div>

          <div className="flex flex-col w-[924px] ">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2 mt-10"
            >
              Product name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Product name"
              required
              className="border-gray-300 pl-4 rounded-3xl focus:ring-violet-500 focus:border-violet-500 block w-full shadow-sm sm:text-sm border-2  p-2 placeholder-gray-400"
            />
          </div>

          {/* Code Field */}
          <div className="flex flex-col w-[924px]">
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
              placeholder="Code"
              required
              className="border-gray-300 pl-4 focus:ring-violet-500 focus:border-violet-500 block w-full shadow-sm sm:text-sm border-2 rounded-full p-2"
              style={{
                borderRadius: "24px",
                border: "1px solid #D9D9D9",
                background: "#FFF",
              }}
            />
          </div>

          {/* Price Field */}
          <div className="flex flex-col w-[924px]">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
              placeholder="฿1,000"
              className="border-gray-300 pl-4 focus:ring-violet-500 focus:border-violet-500 block w-full shadow-sm sm:text-sm border-2 rounded-full p-2"
              style={{
                borderRadius: "24px",
                border: "1px solid #D9D9D9",
                background: "#FFF",
              }}
            />
          </div>

          <div className="flex space-x-[26px]" style={prompt.style}>
            <button
              type="submit"
              disabled={uploading}
              className={`mt-[50px] w-[185px] rounded-3xl h-[56px] flex  justify-center items-center py-2 px-4 border border-transparent  shadow-sm text-sm font-medium text-white ${
                uploading ? "bg-gray-300" : "bg-red-500 hover:bg-red-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            >
              {uploading ? "Uploading..." : "ยกเลิก"}
            </button>
            <button
              type="submit"
              disabled={uploading}
              className={`mt-[50px] w-[185px] rounded-3xl h-[56px] flex  justify-center items-center py-2 px-4 border border-transparent  shadow-sm text-sm font-medium text-white ${
                uploading ? "bg-gray-300" : "bg-red-500 hover:bg-red-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            >
              {uploading ? "กำลังโหลด..." : "ยืนยัน"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ProductUpload;
