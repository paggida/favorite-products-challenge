import mongoose, { Document, Schema, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate';

export type ClientDocument = Document & {
  name: string,
  email: string,
  favorite_products: Schema.Types.ObjectId[],
  createdAt: Date,
  updatedAt: Date
};

type ClientModel = PaginateModel<ClientDocument>;

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

ClientSchema.plugin(paginate);

export default mongoose.model<ClientDocument, ClientModel>('Client', ClientSchema);
