import { Channel } from "../../entities/Channel";
import { LiveHistory } from "../../entities/liveHistory";

export interface ILiveRepository{
    onGetChannel(userid:string):Promise<Channel|null>
    onUpdateStartLiveInfo(channelId:string,roomId:number):Promise<Channel|null>
    onUpdateStopLiveInfo(channelId:string):Promise<Channel|null>
    onGetRecommendedLives(channelId:string):Promise<Channel[]|null>
    onUpdateLiveHistory(streamerId:string,streamName:string,roomId:number,channelId:string):Promise<string|null>
    onUpdateLiveHistoryUsers(RoomId:number,users:string):Promise<string|null>
    onUpdateLiveHistoryEnded(RoomId:number):Promise<string|null>
    fetchAllLives(channelId:string):Promise<LiveHistory[]|null>

}