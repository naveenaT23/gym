import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContent extends Document {
  section: string;
  data: any;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    section: { type: String, required: true, unique: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const Content: Model<IContent> =
  mongoose.models.Content || mongoose.model<IContent>("Content", ContentSchema);

export default Content;
