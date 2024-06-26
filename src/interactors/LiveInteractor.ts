import { Channel } from "../entities/Channel";
import { ILiveInteractor } from "../providers/interfaces/ILiveInteractor";
import { ILiveRepository } from "../providers/interfaces/ILiveRepository";

export class LiveInteractor implements ILiveInteractor {
  private _repository: ILiveRepository;

  constructor(private repository: ILiveRepository) {
    this._repository = repository;
  }
    onGetRecommendedLives=async(channelId:string): Promise<Channel[] | null> =>{
        try {
            return await this._repository.onGetRecommendedLives(channelId)
        } catch (error) {
            throw error
        }
    }
    onUpdateStopLiveInfo=async(channelId: string): Promise<Channel | null> =>{
        try {
            return await this._repository.onUpdateStopLiveInfo(channelId)
        } catch (error) {
            throw error
        }
    }
  onUpdateStartLiveInfo=async(channelId: string, roomId: number): Promise<Channel | null> =>{
        try {
            return await this._repository.onUpdateStartLiveInfo(channelId,roomId)
        } catch (error) {
            throw error
        }
    }
    onGetChannel=async(userid: string): Promise<Channel | null> =>{
        try {
            return await this._repository.onGetChannel(userid)
        } catch (error) {
            throw error
        }
    }

  
}
