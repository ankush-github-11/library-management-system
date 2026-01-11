import mongoose, { Schema, Document } from "mongoose";
export interface IBook extends Document {
  title: string;
  author: string;
  pages: number;
  createdAt: Date;
  updatedAt: Date;
}
const bookSchema: Schema<IBook> = new Schema(
  {
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    pages: {
        type: Number,
        required: true,
    },
  },
  {
    timestamps: true
  }
);
const Book = mongoose.model<IBook>("Book", bookSchema);
export default Book; 