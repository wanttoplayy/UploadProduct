import mongoose from "mongoose";

interface IProduct {
  name: string;
  code: string;
  price: number;
  imageUrl: string;
}

const productSchema = new mongoose.Schema<IProduct>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", productSchema);
