import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    size: { type: String },
    color: { type: String },
    img: { type: String, required: true },
    price: { type: Number, required: true },
    categories: { type: Array },
  },
  { timestamps: true }
);

export type ProductType = mongoose.InferSchemaType<typeof productSchema>;

export default mongoose.model("Product", productSchema);
