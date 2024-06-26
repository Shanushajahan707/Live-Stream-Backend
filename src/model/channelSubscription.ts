import mongoose, { Schema, Document } from "mongoose";

export interface channelSubscriptionDocument extends Document {
  month: number;
  price: number;
  description: { desc: string }[];
}

const channelSubscriptionSchema: Schema<channelSubscriptionDocument> = new Schema({
  month: { type: Number, required: true },
  price: { type: Number, required: true },
  description: [{ desc: { type: String, required: true } }],
});

export const channelSubscriptionModel = mongoose.model<channelSubscriptionDocument>(
  "ChannelSubscription",
  channelSubscriptionSchema
);
