import { User } from "./User";

export interface Channel {
  readonly _id?: string;
  readonly username: User["_id"];
  readonly channelName: string;
  readonly followers: {
    username: string;
    userId: User["_id"];
  }[];
  readonly subscription: number;
  readonly banner?: string;
  readonly video: {
    url: string;
    views: number;
  }[];
  readonly isLive: boolean;
  readonly lastDateOfLive: Date;
  readonly isblocked: boolean;
  readonly liveRoom?: number;
}
