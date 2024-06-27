import { ChannelDocument } from "../model/channelModel";
import { User } from "./User";

export interface LiveHistory {
  readonly _id?: string;
  channelId: ChannelDocument["_id"];
  startDate: Date;
  startTime: Date;
  endTime: Date;
  roomId: number;
  streamerName: User["_id"];
  viewerIds: User["_id"][];
  viewerCount: number;
  duration: number;
}
