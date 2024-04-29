import { User } from "../entities/User";
import { IAdminRepository } from "../providers/interfaces/IAdminRepository";

export class AdminInteractor implements IAdminRepository{

    private _repository:IAdminRepository
    constructor( repository:IAdminRepository){
        this._repository=repository
    }



  async  blockUser(id: string): Promise<boolean> {
    try {
        return this._repository.blockUser(id)
    } catch (error) {
        console.log('error',error);
        throw error
    }
    }

 async getUsers(): Promise<User[]|null> {
        try {
          return  this._repository.getUsers()
        } catch (error) {
            console.log('error',error);
            throw error
        }

    }
    
}