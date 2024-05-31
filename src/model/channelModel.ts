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
  lives: string[];
  isblocked: boolean;
}

const channelSchema: Schema<ChannelDocument> = new Schema({
  username: { type: Schema.Types.ObjectId, ref: "user", required: true },
  channelName: { type: String, required: true },
  followers: {
    type: [{
      username: { type: String, required: true },
      userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    }],
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
  lives: [{ type: String }],
  isblocked: { type: Boolean, default: false },
});

export const ChannelModel = mongoose.model<ChannelDocument>("Channel", channelSchema);
