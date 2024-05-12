import { Channel } from "../entities/Channel";
import { User } from "../entities/User";
import { IAdminInteractor } from "../providers/interfaces/IAdminInteractor";
import { IAdminRepository } from "../providers/interfaces/IAdminRepository";

export class AdminInteractor implements IAdminInteractor {
  private _repository: IAdminRepository;

  constructor(repository: IAdminRepository) {
    this._repository = repository;
  }
  blockChannel = async (
    id: string
  ): Promise<{ update: boolean; channel: Channel | null }> => {
    return await this._repository.blockChannel(id);
  };
  getChannels = async (): Promise<Channel[] | null> => {
    try {
      return await this._repository.getChannels();
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  blockUser = async (
    id: string
  ): Promise<{ update: boolean; user: User | null }> => {
    try {
      return await this._repository.blockUser(id);
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  getUsers = async (): Promise<User[] | null> => {
    try {
      return await this._repository.getUsers();
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
}
