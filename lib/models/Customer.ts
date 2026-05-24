import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRenewalRecord {
  planName: string;
  amountPaid: number;
  paymentStatus: "Paid" | "Pending" | "Partial";
  joiningDate: Date;
  expiryDate: Date;
  dateOfPayment: Date;
}

export interface ICustomer extends Document {
  fullName: string;
  mobileNumber: string;
  whatsAppNumber: string;
  membershipPlan: string;
  joiningDate: Date;
  expiryDate: Date;
  amountPaid: number;
  paymentStatus: "Paid" | "Pending" | "Partial";
  notes?: string;
  renewalHistory: IRenewalRecord[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

const RenewalRecordSchema = new Schema<IRenewalRecord>({
  planName: { type: String, required: true },
  amountPaid: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["Paid", "Pending", "Partial"], required: true },
  joiningDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  dateOfPayment: { type: Date, default: Date.now },
});

const CustomerSchema = new Schema<ICustomer>(
  {
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    whatsAppNumber: { type: String, required: true },
    membershipPlan: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    amountPaid: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["Paid", "Pending", "Partial"], required: true },
    notes: { type: String },
    renewalHistory: [RenewalRecordSchema],
  },
  { timestamps: true }
);

CustomerSchema.virtual("isActive").get(function (this: ICustomer) {
  return this.expiryDate ? new Date() <= new Date(this.expiryDate) : false;
});

CustomerSchema.set("toJSON", { virtuals: true });
CustomerSchema.set("toObject", { virtuals: true });

const Customer: Model<ICustomer> = mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema);
export default Customer;
