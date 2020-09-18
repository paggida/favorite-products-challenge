import mongoose, { Document, Schema, Model } from 'mongoose';

export type ProductDocument = Document & {
  title: string;
};

type ProductModel = Model<ProductDocument>;

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    brand: {
      type: String,
      trim: true,
      required: true,
    },
    image: String,
    price: Number,
    review_score: Number,
  },
  {
    timestamps: true,
  },
);

ProductSchema.index( { "title": 1, "brand": 1 }, { unique: true } );

export default mongoose.model<ProductDocument, ProductModel>('Product', ProductSchema);
