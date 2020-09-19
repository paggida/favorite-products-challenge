import mongoose, { Document, Schema, Model } from 'mongoose';
import paginate from 'mongoose-paginate';

export type ProductDocument = Document & {
  title: string,
  brand: string,
  image: string,
  price: number,
  review_score: number,
  createdAt: Date,
  updatedAt: Date
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
ProductSchema.plugin(paginate);

export default mongoose.model<ProductDocument, ProductModel>('Product', ProductSchema);
