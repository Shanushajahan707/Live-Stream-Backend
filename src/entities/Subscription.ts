import { SubscriptionDocument } from "../model/websiteSubscription";
import { Channel } from "./Channel";
import { User } from "./User";

export interface Subscription {
  readonly _id?: string;
  readonly month: number;
  readonly price: number;
}
export interface channelSubscription {
  readonly _id?: string;
  readonly month: number;
  readonly price: number;
  readonly description: { desc: string }[];
}
export interface ChannelSubscriptionUser {
  readonly _id?: string;
  readonly members: {
    userId: User['_id'];
    userChannelId: Channel['_id'];
    channelId: Channel['_id']; 
    channelPlanId: channelSubscription['_id'];
    paymentId: string;
  };
  readonly createdAt: Date;
  readonly endsIn: Date;
}
export interface WebsiteSubscriptionUser {
  readonly _id?: string;
  readonly user: {
    userId: User['_id'];
    subscriptionPlanId: SubscriptionDocument['_id'];
    paymentId: string;
  };
  readonly createdAt: Date;
}
export interface AdminWalletDocument {
  readonly _id?: string;
  adminId: User["_id"];
  userId: User["_id"];
  amount: number;
  month: number;
  createdAt: Date;
  endsIn: Date;
}