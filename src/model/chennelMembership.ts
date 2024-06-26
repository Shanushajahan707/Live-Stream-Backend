import mongoose, { Schema, Document,  } from "mongoose";
import { UserDocument } from "./userModel";
import { ChannelDocument } from "./channelModel";
import { channelSubscriptionDocument } from "./channelSubscription";

export interface ChannelMembershipDocument extends Document {
  members: {
    userId: UserDocument['_id'];
    userChannelId: ChannelDocument['_id'];
    channelId: ChannelDocument['_id'];
    channelPlanId: channelSubscriptionDocument['_id'];
    paymentId: string;
  };
  createdAt: Date;
  endsIn: Date;
}

const channelMembershipSchema: Schema<ChannelMembershipDocument> = new Schema({
  members: {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userChannelId: { type: Schema.Types.ObjectId, ref: "Channel", required: true },
    channelId: { type: Schema.Types.ObjectId, ref: "Channel", required: true },
    channelPlanId: { type: Schema.Types.ObjectId, ref: "ChannelSubscription", required: true },
    paymentId: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  endsIn: { type: Date, required: true } 
});

export const ChannelMembershipModel = mongoose.model<ChannelMembershipDocument>(
  "ChannelMembership",
  channelMembershipSchema
);
