import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotificationLog extends Document {
  customerId?: mongoose.Types.ObjectId;
  customerName: string;
  mobileNumber: string;
  whatsAppNumber: string;
  planName: string;
  expiryDate: Date;
  type: "7_days_before" | "3_days_before" | "on_expiry" | "after_expiry" | "manual";
  message: string;
  status: "Sent" | "Failed" | "Pending";
  sentAt: Date;
  error?: string;
}

const NotificationLogSchema = new Schema<INotificationLog>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    customerName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    whatsAppNumber: { type: String, required: true },
    planName: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    type: {
      type: String,
      enum: ["7_days_before", "3_days_before", "on_expiry", "after_expiry", "manual"],
      required: true,
    },
    message: { type: String, required: true },
    status: { type: String, enum: ["Sent", "Failed", "Pending"], default: "Pending" },
    sentAt: { type: Date, default: Date.now },
    error: { type: String },
  },
  { timestamps: true }
);

const NotificationLog: Model<INotificationLog> =
  mongoose.models.NotificationLog || mongoose.model<INotificationLog>("NotificationLog", NotificationLogSchema);
export default NotificationLog;
