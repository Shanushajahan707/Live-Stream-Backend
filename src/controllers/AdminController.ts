import { Request,Response,NextFunction } from "express"
import { IAdminInteractor } from "../providers/interfaces/IAdminInteractor"

export class AdminController{
    
    private _interactor:IAdminInteractor
    constructor( interactor:IAdminInteractor){
        this._interactor=interactor
    }

   async onGetUser(req:Request,res:Response,next:NextFunction){
        try {
          const users=  await this._interactor.getUsers()
          if(users){
            return res.status(200).json({message:"Successfully get all the users",users})
          }
            console.log('users',users);
        } catch (error) {
            next(error)
        }
    }
    async onBlockUser(req:Request,res:Response,next:NextFunction){
        try {
            console.log('id is',req.params.id);
            const status=await this._interactor.blockUser(req.params.id)
            if(status){
                console.log('success');
                res.status(200).json({message:"Successfully Updated"})
            }else{
                res.status(400).json({message:"Error toggling user status"})
                
            }
        } catch (error) {
            next(error)
        }
    }
}