import mongoose, { Schema, Document } from "mongoose";
import { ChannelDocument } from "../model/channelModel";
import { User } from "../entities/User";

export interface LiveHistoryDocument extends Document {
  channelId: ChannelDocument["_id"];
  startDate: Date;
  startTime: Date;
  endTime: Date;
  liveName:string
  roomId:number
  streamerName: User["_id"];
  viewerIds: User["_id"][];
  viewerCount: number;
  duration: number;
}

const liveHistorySchema: Schema<LiveHistoryDocument> = new Schema({
  channelId: { type: Schema.Types.ObjectId, ref: "Channel", required: true },
  startDate: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  liveName: { type: String, required: true },
  roomId: { type: Number, required: true },
  streamerName: { type: Schema.Types.ObjectId, ref: "User", required: true },
  viewerIds: { type: [Schema.Types.ObjectId], ref: "User", required: true },
  viewerCount: { type: Number, required: true },
  duration: { type: Number, required: true },
});

export const LiveHistoryModel = mongoose.model<LiveHistoryDocument>(
  "LiveHistory",
  liveHistorySchema
);
