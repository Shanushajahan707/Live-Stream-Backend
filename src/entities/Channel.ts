import { User } from "./User";

export interface Channel {
  readonly _id?: string;
  readonly username: User["_id"];
  readonly channelName: string;
  readonly followers: User['_id'][]; 
  readonly subscription: number;
  readonly banner?: string;
  readonly video: string[];
  readonly lives: string[];
  readonly isblocked: boolean;
 }
 