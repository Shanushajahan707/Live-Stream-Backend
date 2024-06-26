import { Channel } from "../../entities/Channel";

export interface ILiveInteractor{
    onGetChannel(userid:string):Promise<Channel|null>
    onUpdateStartLiveInfo(channelId:string,roomId:number):Promise<Channel|null>
    onUpdateStopLiveInfo(channelId:string):Promise<Channel|null>
    onGetRecommendedLives(channelId:string):Promise<Channel[]|null>
}