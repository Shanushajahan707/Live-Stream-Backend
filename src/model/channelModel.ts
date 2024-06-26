import mongoose, { Schema, Document } from "mongoose";
import { UserDocument } from "./userModel";

export interface ChannelDocument extends Document {
  username: UserDocument["_id"];
  channelName: string;
  followers: {
    username: string;
    userId: UserDocument["_id"];
  }[];
  subscription: number;
  banner: string;
  video: {
    url: string;
    views: number;
  }[];
  isLive: boolean;
  lastDateOfLive: Date;
  isblocked: boolean;
  liveRoom?: number;
}

const channelSchema: Schema<ChannelDocument> = new Schema({
  username: { type: Schema.Types.ObjectId, ref: "User", required: true },
  channelName: { type: String, required: true, index: true }, // Adding index here
  followers: {
    type: [
      {
        username: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      },
    ],
    default: null,
  },
  subscription: { type: Number, default: 0 },
  banner: { type: String },
  video: [
    {
      url: { type: String, required: true },
      views: { type: Number, default: 0 },
    },
  ],
  isLive: { type: Boolean },
  lastDateOfLive: { type: Date },
  isblocked: { type: Boolean, default: false },
  liveRoom: { type: Number },
});

channelSchema.index({ channelName: 'text' });

export const ChannelModel = mongoose.model<ChannelDocument>("Channel", channelSchema);
