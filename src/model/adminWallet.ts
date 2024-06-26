import mongoose, { Schema, Document } from "mongoose";
import { UserDocument } from "./userModel";

// AdminWallet model interface
export interface AdminWalletDocument extends Document {
  adminId: UserDocument["_id"];
  userId: UserDocument["_id"];
  amount: number;
  month: number;
  createdAt: Date;
  endsIn: Date;
  ref: "User";
}

// AdminWallet schema
const adminWalletSchema: Schema<AdminWalletDocument> = new Schema({
  adminId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  month: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  endsIn: { type: Date, required: true }
});

// AdminWallet model
export const AdminWalletModel = mongoose.model<AdminWalletDocument>(
  "AdminWallet",
  adminWalletSchema
);
