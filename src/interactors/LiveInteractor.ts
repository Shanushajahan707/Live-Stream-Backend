import { Channel } from "../entities/Channel";
import { LiveHistory } from "../entities/liveHistory";
import { ILiveInteractor } from "../providers/interfaces/ILiveInteractor";
import { ILiveRepository } from "../providers/interfaces/ILiveRepository";

export class LiveInteractor implements ILiveInteractor {
  private _repository: ILiveRepository;

  constructor(private repository: ILiveRepository) {
    this._repository = repository;
  }
  fetchAllLives = async (channelId: string): Promise<LiveHistory[] | null> => {
    try {
      return await this._repository.fetchAllLives(channelId);
    } catch (error) {
      throw error;
    }
  };
  onUpdateLiveHistoryEnded = async (RoomId: number): Promise<string | null> => {
    try {
      return await this._repository.onUpdateLiveHistoryEnded(RoomId);
    } catch (error) {
      throw error;
    }
  };
  onUpdateLiveHistoryUsers = async (
    RoomId: number,
    users: string
  ): Promise<string | null> => {
    try {
      return await this._repository.onUpdateLiveHistoryUsers(RoomId, users);
    } catch (error) {
      throw error;
    }
  };
  onUpdateLiveHistory = async (
    streamerId: string,
    streamName: string,
    roomId: number,
    channelId: string
  ): Promise<string | null> => {
    try {
      return await this._repository.onUpdateLiveHistory(
        streamerId,
        streamName,
        roomId,
        channelId
      );
    } catch (error) {
      throw error;
    }
  };
  onGetRecommendedLives = async (
    channelId: string
  ): Promise<Channel[] | null> => {
    try {
      return await this._repository.onGetRecommendedLives(channelId);
    } catch (error) {
      throw error;
    }
  };
  onUpdateStopLiveInfo = async (channelId: string): Promise<Channel | null> => {
    try {
      return await this._repository.onUpdateStopLiveInfo(channelId);
    } catch (error) {
      throw error;
    }
  };
  onUpdateStartLiveInfo = async (
    channelId: string,
    roomId: number
  ): Promise<Channel | null> => {
    try {
      return await this._repository.onUpdateStartLiveInfo(channelId, roomId);
    } catch (error) {
      throw error;
    }
  };
  onGetChannel = async (userid: string): Promise<Channel | null> => {
    try {
      return await this._repository.onGetChannel(userid);
    } catch (error) {
      throw error;
    }
  };
}
