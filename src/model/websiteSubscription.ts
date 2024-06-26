import mongoose, { Schema, Document } from "mongoose";

export interface SubscriptionDocument extends Document {
  month: number;
  price: number;
}

const subscriptionSchema: Schema<SubscriptionDocument> = new Schema({
  month: { type: Number, required: true },
  price: { type: Number, required: true },
});

export const SubscriptionModel = mongoose.model<SubscriptionDocument>(
  "Subscription",
  subscriptionSchema
);
