import mongoose, { Schema, Document } from "mongoose";
import { UserDocument } from "./userModel";
import { SubscriptionDocument } from "./websiteSubscription";

export interface WebsiteMembershipDocument extends Document {
  userId: UserDocument['_id'];
  subscriptionPlanId: SubscriptionDocument['_id'];
  paymentId: string;
  createdAt: Date;
}

const websiteMembershipSchema: Schema<WebsiteMembershipDocument> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  subscriptionPlanId: { type: Schema.Types.ObjectId, ref: "WebsiteSubscriptionPlan", required: true },
  paymentId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const WebsiteMembershipModel = mongoose.model<WebsiteMembershipDocument>(
  "WebsiteMembership",
  websiteMembershipSchema
);
