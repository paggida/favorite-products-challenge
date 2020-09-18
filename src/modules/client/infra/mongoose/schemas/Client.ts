import mongoose, { Document, Schema, Model } from 'mongoose';

export type ClientDocument = Document & {
  title: string;
};

type ClientModel = Model<ClientDocument>;

const ClientSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    favorite_products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ClientDocument, ClientModel>('Client', ClientSchema);
